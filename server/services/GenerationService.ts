export const useGenerationService = () => {
  const client = useServerSupabaseClient()

  const setLeonardoGenerationId = async (id: string, leonardo_generation_id: string) => {
    const { data, error } = await client.from('generations').update({ leonardo_generation_id }).eq('id', id)
    if (error) throw error

    return data
  }

  const setGenerationStatus = async (id: string, status: 'PROGRESSING' | 'COMPLETED' | 'ERROR') => {
    const { data, error } = await client.from('generations').update({ status }).eq('id', id)
    if (error) throw error

    return data
  }

  const setGenerationCategory = async (id: string, category: string) => {
    const { data, error } = await client.from('generations').update({ category }).eq('id', id)
    if (error) throw error

    return data
  }

  const setGenerationInfo = async (id: string, info: {
    leonardo_generation_id?: string
    category?: string
    status?: 'PROGRESSING' | 'COMPLETED' | 'ERROR'
    error?: any
  }) => {
    const { data, error } = await client.from('generations').update(info).eq('id', id)
    if (error) throw error

    return data
  }

  return {
    setLeonardoGenerationId,
    setGenerationStatus,
    setGenerationCategory,
    setGenerationInfo
  }
}
