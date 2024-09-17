import { get } from 'lodash-es'
import OpenAI from 'openai'

export const useOpenAiService = () => {
  const { openAi: { apiKey = '', organisationId = '', projectId = '' } } = useRuntimeConfig()
  if (!apiKey || !organisationId || !projectId) {
    throw new Error('Missing required OpenAI API key, organisation ID or project ID')
  }

  const client = new OpenAI({
    apiKey,
    organization: organisationId,
    project: projectId
  })

  const classify = async (prompt: string) => {
    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You will categorize keywords into single word categories based on their context in singular. Use the highest cateory you find for the keyword. Always respond in english and only with the choosen category.' },
        { role: 'user', content: 'Office building' },
        { role: 'assistant', content: 'Architecture' },
        { role: 'user', content: 'Dog' },
        { role: 'assistant', content: 'Animals' },
        { role: 'user', content: 'Mountain' },
        { role: 'assistant', content: 'Geography' },
        { role: 'user', content: 'Car' },
        { role: 'assistant', content: 'Vehicle' },
        { role: 'user', content: 'Roller blades' },
        { role: 'assistant', content: 'Sport' },
        { role: 'user', content: 'Fishing ' },
        { role: 'assistant', content: 'Activity' },
        { role: 'user', content: 'Golf  ' },
        { role: 'assistant', content: 'Sport' },
        { role: 'user', content: 'Superman  ' },
        { role: 'assistant', content: 'Character' },
        { role: 'user', content: 'Sunset over lake' },
        { role: 'assistant', content: 'Nature' },
        { role: 'user', content: 'Bee' },
        { role: 'assistant', content: 'Animal' },
        { role: 'user', content: 'Hornet' },
        { role: 'assistant', content: 'Animal' },
        { role: 'user', content: 'Ant' },
        { role: 'assistant', content: 'Animal' },
        { role: 'user', content: prompt }
      ]
    })

    const category = get(response, 'choices[0].message.content', '').trim()
    return category
  }

  return {
    classify
  }
}
