declare const _default: () => {
    port: number;
    nodeEnv: string;
    supabase: {
        url: string;
        key: string;
        serviceRole: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        name: string;
        url: string | undefined;
    };
};
export default _default;
