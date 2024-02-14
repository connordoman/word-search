/*
 * Created on Mon Feb 12 2024
 * Author: Connor Doman
 */

import { searchParamsToQueryString } from "@/lib/url";
import { redirect } from "next/navigation";

export default async function Home({
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const queryString = searchParamsToQueryString(searchParams);
    redirect(`/2024${queryString}`);
}
