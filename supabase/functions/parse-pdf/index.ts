import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Buffer } from "node:buffer";
import pdf from "npm:pdf-parse";

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { base64Pdf } = await req.json();
    if (!base64Pdf) {
      throw new Error('No PDF provided');
    }

    // Convert base64 to Node.js Buffer
    const buffer = Buffer.from(base64Pdf, 'base64');
    
    // Parse the PDF
    const data = await pdf(buffer);
    const text = data.text;

    // Split text into sentences
    // This matches sequences ending with ., !, or ? and handles decimals properly by looking for word boundaries if needed.
    // A simpler regex for now:
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    // Group into pages (e.g. 15 sentences per page to mimic pagination)
    const pages = [];
    const PAGE_SIZE = 15;
    for (let i = 0; i < sentences.length; i += PAGE_SIZE) {
      const pageSentences = sentences.slice(i, i + PAGE_SIZE).map(s => ({ t: s.trim() + " " }));
      pages.push(pageSentences);
    }

    const bookContent = { pages };

    return new Response(JSON.stringify(bookContent), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
