/*
 * Created on Wed Feb 14 2024
 * Author: Connor Doman
 */

export const DEVELOPMENT = process.env.NODE_ENV === "development";
export const SITE_URL = DEVELOPMENT ? "http://localhost:3000" : process.env.NEXT_PUBLIC_SITE_URL;
