

import { createClient } from "@supabase/supabase-js";
import fs from 'fs';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const id = formData.get('id');

    const files: File[] = [];
    for (const entry of formData.entries()) {
      const [, file] = entry;
      files.push(file as File);
    }
    
    const base64Strings = await Promise.all(files.map(async (file) => {
      const buffer = await readFileAsBuffer(file);
      return buffer.toString('base64');
    }));
      
    console.log(base64Strings);

          // await supabase
            //   .from('tb_places')
            //   .insert({images:fileBuffers}).eq("place_id",id);

    // Now you have access to the base64 strings, you can store them in the database
    
    return new Response(
      JSON.stringify({ message: 'success' }),
      {
        headers: { 'content-type': 'application/json' },
      }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: 'error' }),
      { headers: { 'content-type': 'application/json' }, status: 400 }
    );
  }
}

async function readFileAsBuffer(file: File): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const buffer = Buffer.from(reader.result as ArrayBuffer);
        resolve(buffer);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });
  }
  