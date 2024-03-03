const REFRESH_TOKEN_LIFETIME_HOURS = 2;
const ACCESS_TOKEN_LIFETIME_MINUTES = 20;

export default async function tokenExp() {
    const now = new Date();

    const a = new Date(now.getTime() + ACCESS_TOKEN_LIFETIME_MINUTES * 60 * 1000);
    const r = new Date(now.getTime() + REFRESH_TOKEN_LIFETIME_HOURS * 60 * 60 * 1000);

    return {
        a,
        r,
    };
}
