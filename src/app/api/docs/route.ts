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
  try {
    const descopeClient = DescopeClient({
      projectId: process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID as string,
      managementKey: process.env.DESCOPE_MANAGEMENT_KEY as string
    });

    const relations = await descopeClient.management.authz.targetsRelations([userId]);

    return relations;
  } catch (error) {
    console.log("failed to initialize: " + error)
  }
}