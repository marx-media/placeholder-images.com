import type OpenAI from 'openai'
import { ItemService } from './ItemService'
import type { ICategory } from '~~/shared/models/ICategory'

export class CategoryService extends ItemService<ICategory> {
  constructor(userId: string, private openAi: OpenAI) {
    super(userId, 'categories')
  }

  public classify = async (keyword: string) => {
    const response = await this.openAi.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You will categorize keywords into single word categories based on their context. Always respond in English.' },
        { role: 'user', content: 'Business women' },
        { role: 'assistant', content: 'People, Profession' },
        { role: 'user', content: 'Office building' },
        { role: 'assistant', content: 'Places, Workspaces' },
        { role: 'user', content: 'Dog' },
        { role: 'assistant', content: 'Animals, Mammals' },
        { role: 'user', content: 'Mointain' },
        { role: 'assistant', content: 'Nature, Landforms' },
        { role: 'user', content: 'Car' },
        { role: 'assistant', content: 'Transportation, Vehicles' },
        { role: 'user', content: 'Roller blades' },
        { role: 'assistant', content: 'Equipment' },
        { role: 'user', content: 'Fishing ' },
        { role: 'assistant', content: 'Activity' },
        { role: 'user', content: 'Golf  ' },
        { role: 'assistant', content: 'Sport' },
        { role: 'user', content: keyword },
      ],
    })

    const category = response.choices[0].message.content?.trim()
    if (!category)
      throw new Error('Failed to classify keyword')

    return category
  }

  async getCategories() {
    const snapshot = await this.getItems()
    return snapshot.map(this.withId)
  }

  async createCategoryFromKeyword(keyword: string) {
    const category = await this.classify(keyword)
    return this.createCategory(category)
  }

  async createCategory(category: string) {
    const snapshot = await this.collection.where('name', '==', category).get()
    let docRef
    if (snapshot.empty) {
      docRef = await this.addItem({
        name: category,
        lowercaseName: category.toLowerCase(),
        count: 1 
      })
    } else {
      const doc = snapshot.docs[0]
      docRef = await this.updateItem(doc.id, { count: doc.data().count + 1 })
    }
    // return document reference
    return docRef
  }
}
