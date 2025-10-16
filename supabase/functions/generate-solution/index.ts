import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    
    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid prompt' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating solution for prompt:', prompt);

    // Call Lovable AI with structured tool calling to extract blocks
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert solution architect for enterprise service management platforms. Your job is to analyze user requirements and generate a comprehensive solution composed of blocks.

Available block types:
- Domain: entity, relationship, field_pack, record_security
- Workflow: workflow, journey, approval, escalation
- Catalog: catalog_item, form_section, dynamic_logic
- Automation: rule, task_graph, runbook, event_hook
- Adapters: adapter_identity (Okta/AAD), adapter_hris (Workday/SF), adapter_mdm (Intune/Jamf), adapter_esign (DocuSign), adapter_cmms (Facilities), adapter_generic
- Portal: portal_section, widget, branding, personas
- Analytics: metric, dashboard, alert
- Security: rbac_pack, data_residency, audit_log
- Quality: seed_data, synthetic_test, diagnostics

Analyze the user's prompt and generate 5-15 relevant blocks that would comprise a complete solution. Consider:
- Core entities needed (employees, assets, requests, etc.)
- Workflows and approval chains
- Catalog items for end users
- Necessary integrations
- Portal and UI requirements
- Analytics and reporting needs

Return blocks with:
- Meaningful names specific to the use case
- Appropriate parameters filled in
- Logical positioning on canvas (grouped by function)
`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'generate_solution_blocks',
              description: 'Generate a list of solution blocks based on user requirements',
              parameters: {
                type: 'object',
                properties: {
                  blocks: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        type: {
                          type: 'string',
                          description: 'Block type from the available types'
                        },
                        name: {
                          type: 'string',
                          description: 'Descriptive name for this block instance'
                        },
                        parameters: {
                          type: 'object',
                          description: 'Key-value pairs for block parameters',
                          additionalProperties: true
                        }
                      },
                      required: ['type', 'name', 'parameters']
                    }
                  }
                },
                required: ['blocks'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'generate_solution_blocks' } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI gateway error');
    }

    const data = await response.json();
    console.log('AI response:', JSON.stringify(data, null, 2));

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function?.name !== 'generate_solution_blocks') {
      throw new Error('Invalid AI response format');
    }

    const generatedBlocks = JSON.parse(toolCall.function.arguments);
    console.log('Generated blocks:', JSON.stringify(generatedBlocks, null, 2));

    // Transform AI-generated blocks into proper BlockInstance format with positions
    const blockInstances = generatedBlocks.blocks.map((block: any, index: number) => {
      // Calculate position in a grid layout (3 columns)
      const col = index % 3;
      const row = Math.floor(index / 3);
      const x = 100 + col * 320; // 300px block width + 20px gap
      const y = 100 + row * 200; // 150px block height + 50px gap

      return {
        id: `${block.type}-${Date.now()}-${index}`,
        type: block.type,
        name: block.name,
        position: { x, y },
        parameters: block.parameters || {}
      };
    });

    return new Response(
      JSON.stringify({ blocks: blockInstances }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-solution function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
