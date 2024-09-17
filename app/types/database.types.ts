export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          id: string
          items: number
          slug: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          items?: number
          slug: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          items?: number
          slug?: string
          title?: string
        }
        Relationships: []
      }
      generations: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          error: Json | null
          id: string
          image_count: number | null
          leonardo_generation_id: string | null
          prompt: string
          status: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          error?: Json | null
          id?: string
          image_count?: number | null
          leonardo_generation_id?: string | null
          prompt: string
          status?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          error?: Json | null
          id?: string
          image_count?: number | null
          leonardo_generation_id?: string | null
          prompt?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "generations_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      image_meta: {
        Row: {
          created_at: string
          id: number
          image: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: number
          image: string
          url: string
        }
        Update: {
          created_at?: string
          id?: number
          image?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "image_meta_image_fkey"
            columns: ["image"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
        ]
      }
      image_project: {
        Row: {
          id: string
          image: string
          project: string
        }
        Insert: {
          id?: string
          image: string
          project: string
        }
        Update: {
          id?: string
          image?: string
          project?: string
        }
        Relationships: [
          {
            foreignKeyName: "image_project_image_fkey"
            columns: ["image"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "image_project_project_fkey"
            columns: ["project"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      images: {
        Row: {
          created_at: string
          generation: string
          id: string
        }
        Insert: {
          created_at?: string
          generation: string
          id?: string
        }
        Update: {
          created_at?: string
          generation?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "images_generation_fkey"
            columns: ["generation"]
            isOneToOne: false
            referencedRelation: "generations"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          api_key: string
          created_at: string
          id: string
          title: string
          user: string
        }
        Insert: {
          api_key: string
          created_at?: string
          id?: string
          title: string
          user: string
        }
        Update: {
          api_key?: string
          created_at?: string
          id?: string
          title?: string
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          id: string
          plan: string
          plan_valid_from: string
        }
        Insert: {
          created_at?: string
          id: string
          plan?: string
          plan_valid_from?: string
        }
        Update: {
          created_at?: string
          id?: string
          plan?: string
          plan_valid_from?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

