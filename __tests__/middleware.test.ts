const mockMiddlewareFunction = jest.fn();
const mockWithAuth = jest.fn((middlewareFn, config) => {
  mockWithAuth.middlewareFunction = middlewareFn;
  mockWithAuth.config = config;
  return mockMiddlewareFunction;
});

jest.mock('next-auth/middleware', () => ({
  withAuth: mockWithAuth
}));

const mockRedirect = jest.fn().mockReturnValue('REDIRECT_RESPONSE');
const mockNext = jest.fn().mockReturnValue('NEXT_RESPONSE');

jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    redirect: mockRedirect,
    next: mockNext,
  }
}));

describe('Middleware Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe('Route Protection', () => {
    it('should configure withAuth with correct options', () => {
      require('../middleware');

      expect(mockWithAuth).toHaveBeenCalledTimes(1);
      expect(mockWithAuth).toHaveBeenCalledWith(
        expect.any(Function),
        {
          pages: {
            signIn: "/login",
          },
          callbacks: {
            authorized: expect.any(Function),
          },
        }
      );
    });

    it('should have correct matcher configuration', () => {
      const middlewareModule = require('../middleware');
      
      expect(middlewareModule.config).toEqual({
        matcher: ["/dashboard/:path*", "/admin/:path*"]
      });
    });
  });

  describe('Authorization Callback', () => {
    let authorizedCallback: (params: { token: any }) => boolean;

    beforeEach(() => {
      require('../middleware');
      authorizedCallback = mockWithAuth.config.callbacks.authorized;
    });

    it('should return true when token exists', () => {
      const result = authorizedCallback({ token: { sub: 'user123', role: 'user' } });
      expect(result).toBe(true);
    });

    it('should return false when token is null', () => {
      const result = authorizedCallback({ token: null });
      expect(result).toBe(false);
    });

    it('should return false when token is undefined', () => {
      const result = authorizedCallback({ token: undefined });
      expect(result).toBe(false);
    });

    it('should return true for empty token object', () => {
      const result = authorizedCallback({ token: {} });
      expect(result).toBe(true);
    });

    it('should return false for falsy values', () => {
      const falsyValues = [false, 0, '', NaN];
      
      falsyValues.forEach(value => {
        const result = authorizedCallback({ token: value });
        expect(result).toBe(false);
      });
    });
  });

  describe('Middleware Function Logic', () => {
    let middlewareFunction: (req: any) => any;

    beforeEach(() => {
      require('../middleware');
      middlewareFunction = mockWithAuth.middlewareFunction;
    });

    describe('Admin Route Protection', () => {
      it('should redirect non-admin users from /admin routes', () => {
        const mockReq = {
          nextUrl: {
            pathname: '/admin/users'
          },
          nextauth: {
            token: {
              sub: 'user123',
              role: 'user'
            }
          },
          url: 'http://localhost:3000/admin/users'
        };

        const result = middlewareFunction(mockReq);

        expect(mockRedirect).toHaveBeenCalledWith(
          new URL('/login', 'http://localhost:3000/admin/users')
        );
        expect(result).toBe('REDIRECT_RESPONSE');
      });

      it('should allow admin users to access /admin routes', () => {
        const mockReq = {
          nextUrl: {
            pathname: '/admin/users'
          },
          nextauth: {
            token: {
              sub: 'admin123',
              role: 'admin'
            }
          },
          url: 'http://localhost:3000/admin/users'
        };

        const result = middlewareFunction(mockReq);

        expect(mockRedirect).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
      });

      it('should redirect users without role from /admin routes', () => {
        const mockReq = {
          nextUrl: {
            pathname: '/admin/settings'
          },
          nextauth: {
            token: {
              sub: 'user123'
            }
          },
          url: 'http://localhost:3000/admin/settings'
        };

        const result = middlewareFunction(mockReq);

        expect(mockRedirect).toHaveBeenCalledWith(
          new URL('/login', 'http://localhost:3000/admin/settings')
        );
      });

      it('should redirect users with null role from /admin routes', () => {
        const mockReq = {
          nextUrl: {
            pathname: '/admin'
          },
          nextauth: {
            token: {
              sub: 'user123',
              role: null
            }
          },
          url: 'http://localhost:3000/admin'
        };

        const result = middlewareFunction(mockReq);

        expect(mockRedirect).toHaveBeenCalledWith(
          new URL('/login', 'http://localhost:3000/admin')
        );
      });

      it('should redirect users with undefined role from /admin routes', () => {
        const mockReq = {
          nextUrl: {
            pathname: '/admin/dashboard'
          },
          nextauth: {
            token: {
              sub: 'user123',
              role: undefined
            }
          },
          url: 'http://localhost:3000/admin/dashboard'
        };

        const result = middlewareFunction(mockReq);

        expect(mockRedirect).toHaveBeenCalledWith(
          new URL('/login', 'http://localhost:3000/admin/dashboard')
        );
      });
    });

    describe('Non-Admin Route Access', () => {
      it('should allow access to /dashboard for regular users', () => {
        const mockReq = {
          nextUrl: {
            pathname: '/dashboard'
          },
          nextauth: {
            token: {
              sub: 'user123',
              role: 'user'
            }
          },
          url: 'http://localhost:3000/dashboard'
        };

        const result = middlewareFunction(mockReq);

        expect(mockRedirect).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
      });

      it('should allow access to /dashboard for admin users', () => {
        const mockReq = {
          nextUrl: {
            pathname: '/dashboard/profile'
          },
          nextauth: {
            token: {
              sub: 'admin123',
              role: 'admin'
            }
          },
          url: 'http://localhost:3000/dashboard/profile'
        };

        const result = middlewareFunction(mockReq);

        expect(mockRedirect).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
      });

      it('should allow access to /dashboard for moderator users', () => {
        const mockReq = {
          nextUrl: {
            pathname: '/dashboard/tasks'
          },
          nextauth: {
            token: {
              sub: 'mod123',
              role: 'moderator'
            }
          },
          url: 'http://localhost:3000/dashboard/tasks'
        };

        const result = middlewareFunction(mockReq);

        expect(mockRedirect).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
      });

      it('should allow access to /dashboard for users without specific role', () => {
        const mockReq = {
          nextUrl: {
            pathname: '/dashboard'
          },
          nextauth: {
            token: {
              sub: 'user123'
            }
          },
          url: 'http://localhost:3000/dashboard'
        };

        const result = middlewareFunction(mockReq);

        expect(mockRedirect).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
      });
    });

    describe('Edge Cases', () => {
      it('should handle missing nextauth object gracefully', () => {
        const mockReq = {
          nextUrl: {
            pathname: '/admin/users'
          },
          url: 'http://localhost:3000/admin/users'
        };

        const result = middlewareFunction(mockReq);

        expect(mockRedirect).toHaveBeenCalledWith(
          new URL('/login', 'http://localhost:3000/admin/users')
        );
      });

      it('should handle missing token in nextauth', () => {
        const mockReq = {
          nextUrl: {
            pathname: '/admin/users'
          },
          nextauth: {
          },
          url: 'http://localhost:3000/admin/users'
        };

        const result = middlewareFunction(mockReq);

        expect(mockRedirect).toHaveBeenCalledWith(
          new URL('/login', 'http://localhost:3000/admin/users')
        );
      });

      it('should handle case-sensitive role comparison', () => {
        const mockReq = {
          nextUrl: {
            pathname: '/admin/users'
          },
          nextauth: {
            token: {
              sub: 'user123',
              role: 'ADMIN'
            }
          },
          url: 'http://localhost:3000/admin/users'
        };

        const result = middlewareFunction(mockReq);

        expect(mockRedirect).toHaveBeenCalledWith(
          new URL('/login', 'http://localhost:3000/admin/users')
        );
      });

      it('should handle nested admin paths', () => {
        const mockReq = {
          nextUrl: {
            pathname: '/admin/users/123/edit'
          },
          nextauth: {
            token: {
              sub: 'admin123',
              role: 'admin'
            }
          },
          url: 'http://localhost:3000/admin/users/123/edit'
        };

        const result = middlewareFunction(mockReq);

        expect(mockRedirect).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
      });

      it('should not affect routes that contain admin but do not start with /admin/', () => {
        const mockReq = {
          nextUrl: {
            pathname: '/administration'
          },
          nextauth: {
            token: {
              sub: 'user123',
              role: 'user'
            }
          },
          url: 'http://localhost:3000/administration'
        };

        const result = middlewareFunction(mockReq);

        expect(mockRedirect).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
      });

      it('should handle /admin exact path', () => {
        const mockReq = {
          nextUrl: {
            pathname: '/admin'
          },
          nextauth: {
            token: {
              sub: 'user123',
              role: 'user'
            }
          },
          url: 'http://localhost:3000/admin'
        };

        const result = middlewareFunction(mockReq);

        expect(mockRedirect).toHaveBeenCalledWith(
          new URL('/login', 'http://localhost:3000/admin')
        );
      });

      it('should handle missing nextUrl object', () => {
        const mockReq = {
          nextauth: {
            token: {
              sub: 'user123',
              role: 'user'
            }
          },
          url: 'http://localhost:3000/admin'
        };

        const result = middlewareFunction(mockReq);

        expect(result).toBeUndefined();
      });

      it('should handle missing pathname', () => {
        const mockReq = {
          nextUrl: {
          },
          nextauth: {
            token: {
              sub: 'user123',
              role: 'user'
            }
          },
          url: 'http://localhost:3000/admin'
        };

        const result = middlewareFunction(mockReq);

        expect(result).toBeUndefined();
      });
    });

    describe('Different Admin Roles', () => {
      it('should redirect super-admin from admin routes (strict role checking)', () => {
        const mockReq = {
          nextUrl: {
            pathname: '/admin/settings'
          },
          nextauth: {
            token: {
              sub: 'superadmin123',
              role: 'super-admin'
            }
          },
          url: 'http://localhost:3000/admin/settings'
        };

        const result = middlewareFunction(mockReq);

        expect(mockRedirect).toHaveBeenCalledWith(
          new URL('/login', 'http://localhost:3000/admin/settings')
        );
      });

      it('should not allow moderator to access admin routes', () => {
        const mockReq = {
          nextUrl: {
            pathname: '/admin/users'
          },
          nextauth: {
            token: {
              sub: 'mod123',
              role: 'moderator'
            }
          },
          url: 'http://localhost:3000/admin/users'
        };

        const result = middlewareFunction(mockReq);

        expect(mockRedirect).toHaveBeenCalledWith(
          new URL('/login', 'http://localhost:3000/admin/users')
        );
      });
    });
  });

  describe('URL Construction', () => {
    let middlewareFunction: (req: any) => any;

    beforeEach(() => {
      require('../middleware');
      middlewareFunction = mockWithAuth.middlewareFunction;
    });

    it('should construct correct redirect URL for different base URLs', () => {
      const testCases = [
        {
          originalUrl: 'http://localhost:3000/admin/users',
          description: 'localhost'
        },
        {
          originalUrl: 'https://myapp.com/admin/settings',
          description: 'production domain'
        },
        {
          originalUrl: 'https://staging.myapp.com/admin/dashboard',
          description: 'staging domain'
        },
        {
          originalUrl: 'http://localhost:3001/admin/test',
          description: 'different port'
        }
      ];

      testCases.forEach(({ originalUrl, description }) => {
        jest.clearAllMocks();

        const mockReq = {
          nextUrl: {
            pathname: '/admin/users'
          },
          nextauth: {
            token: {
              role: 'user'
            }
          },
          url: originalUrl
        };

        middlewareFunction(mockReq);

        expect(mockRedirect).toHaveBeenCalledWith(
          new URL('/login', originalUrl)
        );
      });
    });

    it('should handle URLs with query parameters', () => {
      const mockReq = {
        nextUrl: {
          pathname: '/admin/users'
        },
        nextauth: {
          token: {
            role: 'user'
          }
        },
        url: 'http://localhost:3000/admin/users?page=1&limit=10'
      };

      middlewareFunction(mockReq);

      expect(mockRedirect).toHaveBeenCalledWith(
        new URL('/login', 'http://localhost:3000/admin/users?page=1&limit=10')
      );
    });
  });

  describe('Integration Scenarios', () => {
    let middlewareFunction: (req: any) => any;
    let authorizedCallback: (params: { token: any }) => boolean;

    beforeEach(() => {
      require('../middleware');
      middlewareFunction = mockWithAuth.middlewareFunction;
      authorizedCallback = mockWithAuth.config.callbacks.authorized;
    });

    it('should work with complete authentication flow', () => {
      const scenarios = [
        {
          description: 'Admin accessing admin panel',
          token: { sub: 'admin123', role: 'admin' },
          path: '/admin/users',
          shouldBeAuthorized: true,
          shouldRedirect: false
        },
        {
          description: 'User accessing dashboard',
          token: { sub: 'user123', role: 'user' },
          path: '/dashboard',
          shouldBeAuthorized: true,
          shouldRedirect: false
        },
        {
          description: 'User trying to access admin',
          token: { sub: 'user123', role: 'user' },
          path: '/admin',
          shouldBeAuthorized: true,
          shouldRedirect: true
        },
        {
          description: 'No token trying to access protected route',
          token: null,
          path: '/dashboard',
          shouldBeAuthorized: false,
          shouldRedirect: false
        },
        {
          description: 'Moderator accessing dashboard',
          token: { sub: 'mod123', role: 'moderator' },
          path: '/dashboard/reports',
          shouldBeAuthorized: true,
          shouldRedirect: false
        },
        {
          description: 'Moderator trying to access admin',
          token: { sub: 'mod123', role: 'moderator' },
          path: '/admin/settings',
          shouldBeAuthorized: true,
          shouldRedirect: true
        }
      ];

      scenarios.forEach(({ description, token, path, shouldBeAuthorized, shouldRedirect }) => {
        jest.clearAllMocks();

        const authResult = authorizedCallback({ token });
        expect(authResult).toBe(shouldBeAuthorized);

        if (shouldBeAuthorized && token) {
          const mockReq = {
            nextUrl: { pathname: path },
            nextauth: { token },
            url: `http://localhost:3000${path}`
          };

          const result = middlewareFunction(mockReq);

          if (shouldRedirect) {
            expect(mockRedirect).toHaveBeenCalled();
            expect(result).toBe('REDIRECT_RESPONSE');
          } else {
            expect(mockRedirect).not.toHaveBeenCalled();
            expect(result).toBeUndefined();
          }
        }
      });
    });

    it('should handle edge cases in integration flow', () => {
      const edgeCases = [
        {
          description: 'Empty token object accessing admin',
          token: {},
          path: '/admin',
          shouldBeAuthorized: true,
          shouldRedirect: true
        },
        {
          description: 'Token with only sub accessing admin',
          token: { sub: 'user123' },
          path: '/admin/users',
          shouldBeAuthorized: true,
          shouldRedirect: true
        },
        {
          description: 'Token with false role accessing admin',
          token: { sub: 'user123', role: false },
          path: '/admin',
          shouldBeAuthorized: true,
          shouldRedirect: true
        }
      ];

      edgeCases.forEach(({ description, token, path, shouldBeAuthorized, shouldRedirect }) => {
        jest.clearAllMocks();

        const authResult = authorizedCallback({ token });
        expect(authResult).toBe(shouldBeAuthorized);

        if (shouldBeAuthorized) {
          const mockReq = {
            nextUrl: { pathname: path },
            nextauth: { token },
            url: `http://localhost:3000${path}`
          };

          const result = middlewareFunction(mockReq);

          if (shouldRedirect) {
            expect(mockRedirect).toHaveBeenCalled();
          } else {
            expect(mockRedirect).not.toHaveBeenCalled();
          }
        }
      });
    });
  });

  describe('Performance and Reliability', () => {
    let middlewareFunction: (req: any) => any;

    beforeEach(() => {
      require('../middleware');
      middlewareFunction = mockWithAuth.middlewareFunction;
    });

    it('should handle rapid successive calls', () => {
      const requests = Array.from({ length: 100 }, (_, i) => ({
        nextUrl: { pathname: '/admin/test' },
        nextauth: { token: { sub: `user${i}`, role: i % 2 === 0 ? 'admin' : 'user' } },
        url: `http://localhost:3000/admin/test${i}`
      }));

      requests.forEach((req, index) => {
        jest.clearAllMocks();
        const result = middlewareFunction(req);

        if (index % 2 === 0) {
          expect(mockRedirect).not.toHaveBeenCalled();
        } else {
          expect(mockRedirect).toHaveBeenCalled();
        }
      });
    });

it('should handle malformed requests gracefully', () => {
  const malformedRequests = [
    { 
      nextUrl: { pathname: '/admin' }, 
      url: 'http://localhost:3000/admin'
    },
    
    { 
      nextUrl: { pathname: '/admin' }, 
      nextauth: { },
      url: 'http://localhost:3000/admin'
    },
    
    {
      nextUrl: { pathname: '' },
      nextauth: { token: { role: 'user' } },
      url: 'http://localhost:3000'
    },
    
    {
      nextUrl: { pathname: '/dashboard' },
      nextauth: { token: { role: 'user' } },
      url: 'http://localhost:3000/dashboard'
    }
  ];

  malformedRequests.forEach((req, index) => {
    expect(() => {
      const result = middlewareFunction(req);
    }).not.toThrow();
  });
});
  });
});