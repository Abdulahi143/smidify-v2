
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "admins": {
                  Row: {
                    "user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "user_id": string
                  }
                  Update: {
                    "user_id"?: string
                  }
                  Relationships: [
                    
                  ]
                },"pipeline_items": {
                  Row: {
                    "created_at": string | null,"due_note": string | null,"id": string,"kind": string,"name": string,"project_id": string | null,"quote_request_id": string | null,"sort": number,"stage": Database["public"]['Enums']["pipeline_stage"],"updated_at": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string | null,"due_note"?: string | null,"id"?: string,"kind": string,"name": string,"project_id"?: string | null,"quote_request_id"?: string | null,"sort"?: number,"stage"?: Database["public"]['Enums']["pipeline_stage"],"updated_at"?: string | null
                  }
                  Update: {
                    "created_at"?: string | null,"due_note"?: string | null,"id"?: string,"kind"?: string,"name"?: string,"project_id"?: string | null,"quote_request_id"?: string | null,"sort"?: number,"stage"?: Database["public"]['Enums']["pipeline_stage"],"updated_at"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "pipeline_items_project_id_fkey"
      columns: ["project_id"]
isOneToOne: false
      referencedRelation: "projects"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "pipeline_items_quote_request_id_fkey"
      columns: ["quote_request_id"]
isOneToOne: false
      referencedRelation: "quote_requests"
      referencedColumns: ["id"]
    }
                  ]
                },"posts": {
                  Row: {
                    "body_md": string,"category": string,"cover_alt": string | null,"cover_path": string | null,"created_at": string | null,"excerpt": string,"featured": boolean,"id": string,"published_at": string | null,"slug": string,"status": Database["public"]['Enums']["content_status"],"title": string,"updated_at": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "body_md"?: string,"category": string,"cover_alt"?: string | null,"cover_path"?: string | null,"created_at"?: string | null,"excerpt": string,"featured"?: boolean,"id"?: string,"published_at"?: string | null,"slug": string,"status"?: Database["public"]['Enums']["content_status"],"title": string,"updated_at"?: string | null
                  }
                  Update: {
                    "body_md"?: string,"category"?: string,"cover_alt"?: string | null,"cover_path"?: string | null,"created_at"?: string | null,"excerpt"?: string,"featured"?: boolean,"id"?: string,"published_at"?: string | null,"slug"?: string,"status"?: Database["public"]['Enums']["content_status"],"title"?: string,"updated_at"?: string | null
                  }
                  Relationships: [
                    
                  ]
                },"projects": {
                  Row: {
                    "client": string | null,"cover_alt": string | null,"cover_path": string | null,"created_at": string | null,"featured": boolean,"gallery_alts": (string)[],"gallery_paths": (string)[] | null,"id": string,"kinds": (Database["public"]['Enums']["project_kind"])[],"problem": string | null,"published_at": string | null,"quote": string | null,"quote_author": string | null,"result": string | null,"slug": string,"solution": string | null,"status": Database["public"]['Enums']["content_status"],"summary": string,"timeline": string | null,"title": string,"updated_at": string | null,"year": number | null
                  }
                  ComputedFields: never
                  Insert: {
                    "client"?: string | null,"cover_alt"?: string | null,"cover_path"?: string | null,"created_at"?: string | null,"featured"?: boolean,"gallery_alts"?: (string)[],"gallery_paths"?: (string)[] | null,"id"?: string,"kinds"?: (Database["public"]['Enums']["project_kind"])[],"problem"?: string | null,"published_at"?: string | null,"quote"?: string | null,"quote_author"?: string | null,"result"?: string | null,"slug": string,"solution"?: string | null,"status"?: Database["public"]['Enums']["content_status"],"summary": string,"timeline"?: string | null,"title": string,"updated_at"?: string | null,"year"?: number | null
                  }
                  Update: {
                    "client"?: string | null,"cover_alt"?: string | null,"cover_path"?: string | null,"created_at"?: string | null,"featured"?: boolean,"gallery_alts"?: (string)[],"gallery_paths"?: (string)[] | null,"id"?: string,"kinds"?: (Database["public"]['Enums']["project_kind"])[],"problem"?: string | null,"published_at"?: string | null,"quote"?: string | null,"quote_author"?: string | null,"result"?: string | null,"slug"?: string,"solution"?: string | null,"status"?: Database["public"]['Enums']["content_status"],"summary"?: string,"timeline"?: string | null,"title"?: string,"updated_at"?: string | null,"year"?: number | null
                  }
                  Relationships: [
                    
                  ]
                },"quote_requests": {
                  Row: {
                    "company": string | null,"created_at": string | null,"email": string,"handled": boolean,"id": string,"kind": string | null,"message": string | null,"name": string | null,"phone": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "company"?: string | null,"created_at"?: string | null,"email": string,"handled"?: boolean,"id"?: string,"kind"?: string | null,"message"?: string | null,"name"?: string | null,"phone"?: string | null
                  }
                  Update: {
                    "company"?: string | null,"created_at"?: string | null,"email"?: string,"handled"?: boolean,"id"?: string,"kind"?: string | null,"message"?: string | null,"name"?: string | null,"phone"?: string | null
                  }
                  Relationships: [
                    
                  ]
                },"services": {
                  Row: {
                    "body": string,"id": string,"items": (string)[],"num": string,"sort": number,"title": string
                  }
                  ComputedFields: never
                  Insert: {
                    "body": string,"id"?: string,"items"?: (string)[],"num": string,"sort"?: number,"title": string
                  }
                  Update: {
                    "body"?: string,"id"?: string,"items"?: (string)[],"num"?: string,"sort"?: number,"title"?: string
                  }
                  Relationships: [
                    
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "is_admin":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           }
          }
          Enums: {
            "content_status": "draft"|"in_review"|"published","pipeline_stage": "idea"|"discovery"|"design"|"build"|"test"|"launch"|"care","project_kind": "website"|"mobile"|"network"|"ai"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            "content_status": ["draft", "in_review", "published"],"pipeline_stage": ["idea", "discovery", "design", "build", "test", "launch", "care"],"project_kind": ["website", "mobile", "network", "ai"]
          }
        }
} as const
