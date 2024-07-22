import { Configuration, OpenAIApi } from 'openai-edge'
import { Message, OpenAIStream, StreamingTextResponse } from 'ai'
import { getContext } from '@/utils/context'
import DescopeClient from '@descope/node-sdk';
import { NextResponse } from 'next/server';

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

// IMPORTANT! Set the runtime to edge
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
    //  baseUrl="<URL>" // When initializing the Descope clientyou can also configure the baseUrl ex: https://auth.company.com  - this is useful when you utilize CNAME within your Descope project.
    const descopeClient = DescopeClient({
      projectId: 'P2jWckKUbwgC4qyurDSiKZwGa7Cq',
      managementKey: managementKey
    });

    const relations = await descopeClient.management.authz.targetsRelations([userId]);

    return relations;
  } catch (error) {
    // handle the error
    console.log("failed to initialize: " + error)
  }

}