import DescopeClient from '@descope/node-sdk';
import { NextResponse } from 'next/server';

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()
    const relations = await getRelations(userId);
    return NextResponse.json({ success: true, relations })
  } catch (e) {
    console.log("failed to fetch relations: " + e)
    return NextResponse.json({ success: false, error: "Failed fetching relations" })
  }
}

async function getRelations(userId: string) {
  const managementKey = "K2jXxMeRCvn5JYah0ToyyS5eJPLCYcz0pkUfUWt9NfgTWv6EJHLtUtY3vDI22woGalxkcTL"

  try {
    const descopeClient = DescopeClient({
      projectId: 'P2jWckKUbwgC4qyurDSiKZwGa7Cq',
      managementKey: managementKey
    });

    const relations = await descopeClient.management.authz.targetsRelations([userId]);

    return relations;
  } catch (error) {
    console.log("failed to initialize: " + error)
  }
}