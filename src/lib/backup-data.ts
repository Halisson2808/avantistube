// Schema completo do banco de dados AvantisTube - hardcoded para backup
export const SYSTEM_SCHEMA = {
  enums: {
    content_type_enum: ["longform", "shorts"],
  },
  tables: {
    monitored_channels: {
      columns: [
        { name: "id", type: "uuid", nullable: false, default: "gen_random_uuid()" },
        { name: "user_id", type: "uuid", nullable: false },
        { name: "channel_id", type: "text", nullable: false },
        { name: "channel_name", type: "text", nullable: false },
        { name: "channel_thumbnail", type: "text", nullable: true },
        { name: "description", type: "text", nullable: true },
        { name: "custom_url", type: "text", nullable: true },
        { name: "subscriber_count", type: "bigint", nullable: true, default: "0" },
        { name: "video_count", type: "integer", nullable: true, default: "0" },
        { name: "view_count", type: "bigint", nullable: true, default: "0" },
        { name: "published_at", type: "timestamp with time zone", nullable: true },
        { name: "added_at", type: "timestamp with time zone", nullable: false, default: "now()" },
        { name: "last_updated", type: "timestamp with time zone", nullable: false, default: "now()" },
        { name: "content_type", type: "content_type_enum", nullable: true, default: "'longform'" },
        { name: "niche", type: "text", nullable: true },
        { name: "notes", type: "text", nullable: true },
      ],
      rls_policies: [
        { name: "Users can view their own monitored channels", command: "SELECT", using: "auth.uid() = user_id" },
        { name: "Users can insert their own monitored channels", command: "INSERT", with_check: "auth.uid() = user_id" },
        { name: "Users can update their own monitored channels", command: "UPDATE", using: "auth.uid() = user_id" },
        { name: "Users can delete their own monitored channels", command: "DELETE", using: "auth.uid() = user_id" },
      ],
    },
    channel_history: {
      columns: [
        { name: "id", type: "uuid", nullable: false, default: "gen_random_uuid()" },
        { name: "channel_id", type: "text", nullable: false },
        { name: "user_id", type: "uuid", nullable: false },
        { name: "recorded_at", type: "timestamp with time zone", nullable: false, default: "now()" },
        { name: "subscriber_count", type: "bigint", nullable: true },
        { name: "view_count", type: "bigint", nullable: true },
        { name: "video_count", type: "integer", nullable: true },
      ],
      rls_policies: [
        { name: "Users can view their own channel history", command: "SELECT", using: "auth.uid() = user_id" },
        { name: "Users can insert their own channel history", command: "INSERT", with_check: "auth.uid() = user_id" },
      ],
    },
    my_channels: {
      columns: [
        { name: "id", type: "uuid", nullable: false, default: "gen_random_uuid()" },
        { name: "user_id", type: "uuid", nullable: false },
        { name: "channel_id", type: "text", nullable: false },
        { name: "channel_name", type: "text", nullable: false },
        { name: "channel_thumbnail", type: "text", nullable: true },
        { name: "description", type: "text", nullable: true },
        { name: "custom_url", type: "text", nullable: true },
        { name: "subscriber_count", type: "bigint", nullable: true, default: "0" },
        { name: "video_count", type: "integer", nullable: true, default: "0" },
        { name: "view_count", type: "bigint", nullable: true, default: "0" },
        { name: "published_at", type: "timestamp with time zone", nullable: true },
        { name: "is_primary", type: "boolean", nullable: true, default: "false" },
        { name: "added_at", type: "timestamp with time zone", nullable: false, default: "now()" },
        { name: "last_updated", type: "timestamp with time zone", nullable: false, default: "now()" },
      ],
      rls_policies: [
        { name: "Users can view their own channels", command: "SELECT", using: "auth.uid() = user_id" },
        { name: "Users can insert their own channels", command: "INSERT", with_check: "auth.uid() = user_id" },
        { name: "Users can update their own channels", command: "UPDATE", using: "auth.uid() = user_id" },
        { name: "Users can delete their own channels", command: "DELETE", using: "auth.uid() = user_id" },
      ],
    },
    video_snapshots: {
      columns: [
        { name: "id", type: "uuid", nullable: false, default: "gen_random_uuid()" },
        { name: "user_id", type: "uuid", nullable: false },
        { name: "channel_id", type: "text", nullable: false },
        { name: "video_id", type: "text", nullable: false },
        { name: "title", type: "text", nullable: false },
        { name: "thumbnail_url", type: "text", nullable: true },
        { name: "view_count", type: "bigint", nullable: true, default: "0" },
        { name: "like_count", type: "bigint", nullable: true, default: "0" },
        { name: "comment_count", type: "bigint", nullable: true, default: "0" },
        { name: "published_at", type: "timestamp with time zone", nullable: true },
        { name: "position", type: "integer", nullable: true, default: "1" },
        { name: "is_active", type: "boolean", nullable: true, default: "true" },
        { name: "is_viral", type: "boolean", nullable: true, default: "false" },
        { name: "fetched_at", type: "timestamp with time zone", nullable: false, default: "now()" },
        { name: "created_at", type: "timestamp with time zone", nullable: false, default: "now()" },
      ],
      rls_policies: [
        { name: "Users can view their own video snapshots", command: "SELECT", using: "auth.uid() = user_id" },
        { name: "Users can insert their own video snapshots", command: "INSERT", with_check: "auth.uid() = user_id" },
        { name: "Users can update their own video snapshots", command: "UPDATE", using: "auth.uid() = user_id" },
        { name: "Users can delete their own video snapshots", command: "DELETE", using: "auth.uid() = user_id" },
      ],
    },
    profiles: {
      columns: [
        { name: "id", type: "uuid", nullable: false },
        { name: "email", type: "text", nullable: false },
        { name: "full_name", type: "text", nullable: true },
        { name: "avatar_url", type: "text", nullable: true },
        { name: "created_at", type: "timestamp with time zone", nullable: false, default: "now()" },
        { name: "updated_at", type: "timestamp with time zone", nullable: false, default: "now()" },
      ],
      rls_policies: [
        { name: "Users can view their own profile", command: "SELECT", using: "auth.uid() = id" },
        { name: "Users can insert their own profile", command: "INSERT", with_check: "auth.uid() = id" },
        { name: "Users can update their own profile", command: "UPDATE", using: "auth.uid() = id" },
      ],
    },
  },
  functions: [
    {
      name: "handle_new_user",
      language: "plpgsql",
      security: "DEFINER",
      body: "BEGIN\n  INSERT INTO public.profiles (id, email, full_name)\n  VALUES (\n    NEW.id,\n    NEW.email,\n    COALESCE(NEW.raw_user_meta_data->>'full_name', '')\n  );\n  RETURN NEW;\nEND;",
      trigger: { name: "on_auth_user_created", table: "auth.users", event: "AFTER INSERT", for_each: "ROW" },
    },
    {
      name: "handle_updated_at",
      language: "plpgsql",
      security: "DEFINER",
      body: "BEGIN\n  NEW.updated_at = NOW();\n  RETURN NEW;\nEND;",
      trigger: { name: "update_profiles_updated_at", table: "public.profiles", event: "BEFORE UPDATE", for_each: "ROW" },
    },
    {
      name: "update_monitored_channels_last_updated",
      language: "plpgsql",
      security: "DEFINER",
      body: "BEGIN\n  NEW.last_updated = NOW();\n  RETURN NEW;\nEND;",
      trigger: { name: "update_monitored_channels_last_updated_trigger", table: "public.monitored_channels", event: "BEFORE UPDATE", for_each: "ROW" },
    },
  ],
};

// Configuracoes do sistema
export const SYSTEM_CONFIG = {
  required_secrets: [
    "VITE_YOUTUBE_API_KEY",
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_DB_URL",
    "SUPABASE_PUBLISHABLE_KEY",
  ],
  supabase_project_id: "lpjuzjcstdgcmujykdfn",
  supabase_url: "https://lpjuzjcstdgcmujykdfn.supabase.co",
  supabase_anon_key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwanV6amNzdGRnY211anlrZGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MzY0MjksImV4cCI6MjA4MDAxMjQyOX0.-G8gL-00k8ftmQqDktB331jiJvFLVDHKszfRNG8Mffg",
  edge_functions_config: {
    "add-channel": { verify_jwt: true },
    "update-all-channels": { verify_jwt: false },
    "youtube": { verify_jwt: false },
  },
};

// Edge functions code will be fetched from the actual source files at export time
// Since we can't import them as text in the browser, we store references
export const EDGE_FUNCTIONS_FILES = [
  "add-channel/index.ts",
  "youtube/index.ts",
  "update-all-channels/index.ts",
];
