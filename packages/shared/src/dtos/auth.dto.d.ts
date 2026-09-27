/** Standard API response wrapper */
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
/** User object returned from auth endpoints */
export interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
    createdAt: string;
    updatedAt: string;
}
/** Session object */
export interface Session {
    id: string;
    userId: string;
    token: string;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
}
/** Auth session response (user + session) */
export interface AuthSession {
    user: User;
    session: Session;
}
/** Health check response */
export interface HealthCheckResponse {
    status: "ok";
    timestamp: string;
    uptime: number;
}
//# sourceMappingURL=auth.dto.d.ts.map