export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      competition: {
        Row: {
          apply_date: string | null;
          created_at: string;
          description: string | null;
          end_date: string | null;
          id: string;
          image_url: string | null;
          link: string | null;
          location: string | null;
          name: string | null;
          organizator: string | null;
          start_date: string | null;
          visible_date_range: string | null;
        };
        Insert: {
          apply_date?: string | null;
          created_at?: string;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          image_url?: string | null;
          link?: string | null;
          location?: string | null;
          name?: string | null;
          organizator?: string | null;
          start_date?: string | null;
          visible_date_range?: string | null;
        };
        Update: {
          apply_date?: string | null;
          created_at?: string;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          image_url?: string | null;
          link?: string | null;
          location?: string | null;
          name?: string | null;
          organizator?: string | null;
          start_date?: string | null;
          visible_date_range?: string | null;
        };
        Relationships: [];
      };
      course: {
        Row: {
          created_at: string;
          id: string;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string | null;
        };
        Relationships: [];
      };
      course_video: {
        Row: {
          course_id: string | null;
          created_at: string;
          id: string;
          video_id: string | null;
        };
        Insert: {
          course_id?: string | null;
          created_at?: string;
          id?: string;
          video_id?: string | null;
        };
        Update: {
          course_id?: string | null;
          created_at?: string;
          id?: string;
          video_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "course_video_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "course";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "course_video_video_id_fkey";
            columns: ["video_id"];
            isOneToOne: false;
            referencedRelation: "user_video";
            referencedColumns: ["id"];
          }
        ];
      };
      epic: {
        Row: {
          created_at: string;
          department_id: string | null;
          id: string;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          department_id?: string | null;
          id?: string;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          department_id?: string | null;
          id?: string;
          name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "feature_department_id_fkey";
            columns: ["department_id"];
            isOneToOne: false;
            referencedRelation: "project_department";
            referencedColumns: ["id"];
          }
        ];
      };
      event: {
        Row: {
          created_at: string;
          description: string | null;
          end_date: string | null;
          id: string;
          image_url: string | null;
          location: string | null;
          name: string | null;
          organizator: string | null;
          start_date: string | null;
          visible_date_range: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          image_url?: string | null;
          location?: string | null;
          name?: string | null;
          organizator?: string | null;
          start_date?: string | null;
          visible_date_range?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          image_url?: string | null;
          location?: string | null;
          name?: string | null;
          organizator?: string | null;
          start_date?: string | null;
          visible_date_range?: string | null;
        };
        Relationships: [];
      };
      feature: {
        Row: {
          created_at: string;
          epic_id: string | null;
          id: string;
          name: string | null;
          story_id: string | null;
        };
        Insert: {
          created_at?: string;
          epic_id?: string | null;
          id?: string;
          name?: string | null;
          story_id?: string | null;
        };
        Update: {
          created_at?: string;
          epic_id?: string | null;
          id?: string;
          name?: string | null;
          story_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "feature_epic_id_fkey";
            columns: ["epic_id"];
            isOneToOne: false;
            referencedRelation: "epic";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "feature_epic_id_fkey1";
            columns: ["epic_id"];
            isOneToOne: false;
            referencedRelation: "epic";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "feature_story_id_fkey";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "story";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "feature_story_id_fkey1";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "story";
            referencedColumns: ["id"];
          }
        ];
      };
      field: {
        Row: {
          created_at: string;
          id: string;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string | null;
        };
        Relationships: [];
      };
      idea: {
        Row: {
          created_at: string;
          created_user: string | null;
          id: string;
          image_url: string | null;
          is_active: boolean | null;
          is_archieved: boolean | null;
          related_organization: string | null;
          text: string | null;
        };
        Insert: {
          created_at?: string;
          created_user?: string | null;
          id?: string;
          image_url?: string | null;
          is_active?: boolean | null;
          is_archieved?: boolean | null;
          related_organization?: string | null;
          text?: string | null;
        };
        Update: {
          created_at?: string;
          created_user?: string | null;
          id?: string;
          image_url?: string | null;
          is_active?: boolean | null;
          is_archieved?: boolean | null;
          related_organization?: string | null;
          text?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "idea_created_user_fkey";
            columns: ["created_user"];
            isOneToOne: false;
            referencedRelation: "profile";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "idea_related_organization_fkey";
            columns: ["related_organization"];
            isOneToOne: false;
            referencedRelation: "organization";
            referencedColumns: ["id"];
          }
        ];
      };
      job: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          is_active: boolean | null;
          name: string | null;
          organization_id: string | null;
          type: Database["public"]["Enums"]["job_type"] | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string | null;
          organization_id?: string | null;
          type?: Database["public"]["Enums"]["job_type"] | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string | null;
          organization_id?: string | null;
          type?: Database["public"]["Enums"]["job_type"] | null;
        };
        Relationships: [
          {
            foreignKeyName: "job_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organization";
            referencedColumns: ["id"];
          }
        ];
      };
      job_applicant: {
        Row: {
          created_at: string;
          id: string;
          job_id: string | null;
          profile_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          job_id?: string | null;
          profile_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          job_id?: string | null;
          profile_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "job_applicant_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "job";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "job_applicant_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profile";
            referencedColumns: ["id"];
          }
        ];
      };
      organization: {
        Row: {
          created_at: string;
          id: string;
          image_url: string | null;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          image_url?: string | null;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          image_url?: string | null;
          name?: string | null;
        };
        Relationships: [];
      };
      profile: {
        Row: {
          created_at: string;
          id: string;
          image_url: string | null;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          image_url?: string | null;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          image_url?: string | null;
          name?: string | null;
        };
        Relationships: [];
      };
      profile_fields: {
        Row: {
          created_at: string;
          field_id: string;
          id: string;
          profile_id: string;
        };
        Insert: {
          created_at?: string;
          field_id: string;
          id?: string;
          profile_id: string;
        };
        Update: {
          created_at?: string;
          field_id?: string;
          id?: string;
          profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profile_fields_field_id_fkey";
            columns: ["field_id"];
            isOneToOne: false;
            referencedRelation: "field";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profile_fields_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profile";
            referencedColumns: ["id"];
          }
        ];
      };
      project: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          image_url: string | null;
          is_active: boolean | null;
          is_public: boolean | null;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          is_active?: boolean | null;
          is_public?: boolean | null;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          is_active?: boolean | null;
          is_public?: boolean | null;
          name?: string | null;
        };
        Relationships: [];
      };
      project_department: {
        Row: {
          created_at: string;
          id: string;
          name: string | null;
          project_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name?: string | null;
          project_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string | null;
          project_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "department_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "project";
            referencedColumns: ["id"];
          }
        ];
      };
      project_department_idea: {
        Row: {
          created_at: string;
          department_id: string | null;
          id: string;
          profile_id: string | null;
          status: Database["public"]["Enums"]["department_task_status"] | null;
          text: string | null;
        };
        Insert: {
          created_at?: string;
          department_id?: string | null;
          id?: string;
          profile_id?: string | null;
          status?: Database["public"]["Enums"]["department_task_status"] | null;
          text?: string | null;
        };
        Update: {
          created_at?: string;
          department_id?: string | null;
          id?: string;
          profile_id?: string | null;
          status?: Database["public"]["Enums"]["department_task_status"] | null;
          text?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "project_department_idea_department_id_fkey";
            columns: ["department_id"];
            isOneToOne: false;
            referencedRelation: "project_department";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_department_idea_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profile";
            referencedColumns: ["id"];
          }
        ];
      };
      project_department_task: {
        Row: {
          created_at: string;
          department_id: string | null;
          id: string;
          status: Database["public"]["Enums"]["department_task_status"] | null;
          text: string | null;
        };
        Insert: {
          created_at?: string;
          department_id?: string | null;
          id?: string;
          status?: Database["public"]["Enums"]["department_task_status"] | null;
          text?: string | null;
        };
        Update: {
          created_at?: string;
          department_id?: string | null;
          id?: string;
          status?: Database["public"]["Enums"]["department_task_status"] | null;
          text?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "project_department_task_department_id_fkey";
            columns: ["department_id"];
            isOneToOne: false;
            referencedRelation: "project_department";
            referencedColumns: ["id"];
          }
        ];
      };
      project_event: {
        Row: {
          created_at: string;
          date: string | null;
          id: string;
          name: string | null;
          project_id: string | null;
        };
        Insert: {
          created_at?: string;
          date?: string | null;
          id?: string;
          name?: string | null;
          project_id?: string | null;
        };
        Update: {
          created_at?: string;
          date?: string | null;
          id?: string;
          name?: string | null;
          project_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "project_event_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "project";
            referencedColumns: ["id"];
          }
        ];
      };
      project_invite: {
        Row: {
          accepted_at: string | null;
          accepted_by: string | null;
          created_at: string;
          created_by: string;
          email: string;
          expires_at: string;
          id: string;
          invited_at: string;
          invited_by: string;
          name: string;
          project_id: string;
          role: string;
          status: string;
          updated_by: string;
        };
        Insert: {
          accepted_at?: string | null;
          accepted_by?: string | null;
          created_at?: string;
          created_by: string;
          email: string;
          expires_at?: string;
          id?: string;
          invited_at?: string;
          invited_by: string;
          name: string;
          project_id: string;
          role: string;
          status?: string;
          updated_by: string;
        };
        Update: {
          accepted_at?: string | null;
          accepted_by?: string | null;
          created_at?: string;
          created_by?: string;
          email?: string;
          expires_at?: string;
          id?: string;
          invited_at?: string;
          invited_by?: string;
          name?: string;
          project_id?: string;
          role?: string;
          status?: string;
          updated_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_invite_accepted_by_fkey";
            columns: ["accepted_by"];
            isOneToOne: false;
            referencedRelation: "profile";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_invite_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profile";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_invite_invited_by_fkey";
            columns: ["invited_by"];
            isOneToOne: false;
            referencedRelation: "profile";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_invite_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "project";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_invite_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profile";
            referencedColumns: ["id"];
          }
        ];
      };
      project_meeting: {
        Row: {
          created_at: string;
          end_time: string | null;
          id: string;
          is_active: boolean | null;
          name: string | null;
          project_id: string | null;
          start_time: string | null;
        };
        Insert: {
          created_at?: string;
          end_time?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string | null;
          project_id?: string | null;
          start_time?: string | null;
        };
        Update: {
          created_at?: string;
          end_time?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string | null;
          project_id?: string | null;
          start_time?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "project_meeting_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "project";
            referencedColumns: ["id"];
          }
        ];
      };
      project_meeting_note: {
        Row: {
          created_at: string;
          created_user_id: string | null;
          id: string;
          project_meeting_id: string | null;
          text: string | null;
        };
        Insert: {
          created_at?: string;
          created_user_id?: string | null;
          id?: string;
          project_meeting_id?: string | null;
          text?: string | null;
        };
        Update: {
          created_at?: string;
          created_user_id?: string | null;
          id?: string;
          project_meeting_id?: string | null;
          text?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "project_meeting_note_created_user_id_fkey";
            columns: ["created_user_id"];
            isOneToOne: false;
            referencedRelation: "profile";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_meeting_note_project_meeting_id_fkey";
            columns: ["project_meeting_id"];
            isOneToOne: false;
            referencedRelation: "project_meeting";
            referencedColumns: ["id"];
          }
        ];
      };
      project_meeting_user: {
        Row: {
          created_at: string;
          id: string;
          project_meeting_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          project_meeting_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          project_meeting_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_meeting_user_project_meeting_id_fkey";
            columns: ["project_meeting_id"];
            isOneToOne: false;
            referencedRelation: "project_meeting";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_meeting_user_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profile";
            referencedColumns: ["id"];
          }
        ];
      };
      project_users: {
        Row: {
          created_at: string;
          id: string;
          profile_id: string | null;
          project_id: string | null;
          role: Database["public"]["Enums"]["project_role"] | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          profile_id?: string | null;
          project_id?: string | null;
          role?: Database["public"]["Enums"]["project_role"] | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          profile_id?: string | null;
          project_id?: string | null;
          role?: Database["public"]["Enums"]["project_role"] | null;
        };
        Relationships: [
          {
            foreignKeyName: "project_users_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profile";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_users_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "project";
            referencedColumns: ["id"];
          }
        ];
      };
      story: {
        Row: {
          created_at: string;
          end_date: string | null;
          id: string;
          index: number | null;
          is_active: boolean | null;
          name: string | null;
          project_id: string | null;
          start_date: string | null;
          status: Database["public"]["Enums"]["story_status"] | null;
        };
        Insert: {
          created_at?: string;
          end_date?: string | null;
          id?: string;
          index?: number | null;
          is_active?: boolean | null;
          name?: string | null;
          project_id?: string | null;
          start_date?: string | null;
          status?: Database["public"]["Enums"]["story_status"] | null;
        };
        Update: {
          created_at?: string;
          end_date?: string | null;
          id?: string;
          index?: number | null;
          is_active?: boolean | null;
          name?: string | null;
          project_id?: string | null;
          start_date?: string | null;
          status?: Database["public"]["Enums"]["story_status"] | null;
        };
        Relationships: [
          {
            foreignKeyName: "story_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "project";
            referencedColumns: ["id"];
          }
        ];
      };
      story_item: {
        Row: {
          created_at: string;
          id: string;
          is_finished: boolean | null;
          story_id: string | null;
          text: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_finished?: boolean | null;
          story_id?: string | null;
          text?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_finished?: boolean | null;
          story_id?: string | null;
          text?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "story_task_story_id_fkey";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "story";
            referencedColumns: ["id"];
          }
        ];
      };
      story_user: {
        Row: {
          created_at: string;
          id: string;
          profile_id: string | null;
          story_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          profile_id?: string | null;
          story_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          profile_id?: string | null;
          story_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "story_users_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profile";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "story_users_story_id_fkey";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "story";
            referencedColumns: ["id"];
          }
        ];
      };
      task: {
        Row: {
          created_at: string;
          date: string | null;
          id: string;
          is_finished: boolean;
          profile_id: string | null;
          story_id: string | null;
          text: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string;
          date?: string | null;
          id?: string;
          is_finished?: boolean;
          profile_id?: string | null;
          story_id?: string | null;
          text?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          date?: string | null;
          id?: string;
          is_finished?: boolean;
          profile_id?: string | null;
          story_id?: string | null;
          text?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "task_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profile";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "task_story_id_fkey";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "story";
            referencedColumns: ["id"];
          }
        ];
      };
      tool: {
        Row: {
          created_at: string;
          id: string;
          image_url: string | null;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          image_url?: string | null;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          image_url?: string | null;
          name?: string | null;
        };
        Relationships: [];
      };
      transaction: {
        Row: {
          amount: number | null;
          created_at: string;
          id: string;
          project_id: string | null;
          title: string | null;
        };
        Insert: {
          amount?: number | null;
          created_at?: string;
          id?: string;
          project_id?: string | null;
          title?: string | null;
        };
        Update: {
          amount?: number | null;
          created_at?: string;
          id?: string;
          project_id?: string | null;
          title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "transaction_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "project";
            referencedColumns: ["id"];
          }
        ];
      };
      user_event: {
        Row: {
          added_profile: string | null;
          created_at: string;
          description: string | null;
          end_date: string | null;
          id: string;
          image_url: string | null;
          location: string | null;
          name: string | null;
          organization_id: string | null;
          organizator: string | null;
          start_date: string | null;
          visible_date_range: string | null;
        };
        Insert: {
          added_profile?: string | null;
          created_at?: string;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          image_url?: string | null;
          location?: string | null;
          name?: string | null;
          organization_id?: string | null;
          organizator?: string | null;
          start_date?: string | null;
          visible_date_range?: string | null;
        };
        Update: {
          added_profile?: string | null;
          created_at?: string;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          image_url?: string | null;
          location?: string | null;
          name?: string | null;
          organization_id?: string | null;
          organizator?: string | null;
          start_date?: string | null;
          visible_date_range?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_event_added_profile_fkey";
            columns: ["added_profile"];
            isOneToOne: false;
            referencedRelation: "profile";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_event_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organization";
            referencedColumns: ["id"];
          }
        ];
      };
      user_project: {
        Row: {
          added_profile: string | null;
          created_at: string;
          description: string | null;
          field_id: string | null;
          id: string;
          name: string | null;
        };
        Insert: {
          added_profile?: string | null;
          created_at?: string;
          description?: string | null;
          field_id?: string | null;
          id?: string;
          name?: string | null;
        };
        Update: {
          added_profile?: string | null;
          created_at?: string;
          description?: string | null;
          field_id?: string | null;
          id?: string;
          name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_project_added_profile_fkey";
            columns: ["added_profile"];
            isOneToOne: false;
            referencedRelation: "profile";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_project_field_id_fkey";
            columns: ["field_id"];
            isOneToOne: false;
            referencedRelation: "field";
            referencedColumns: ["id"];
          }
        ];
      };
      user_project_link: {
        Row: {
          created_at: string;
          id: string;
          link: string | null;
          user_project_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          link?: string | null;
          user_project_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          link?: string | null;
          user_project_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_project_link_user_project_id_fkey";
            columns: ["user_project_id"];
            isOneToOne: false;
            referencedRelation: "user_project";
            referencedColumns: ["id"];
          }
        ];
      };
      user_video: {
        Row: {
          added_profile_id: string | null;
          channel_title: string | null;
          comment: string | null;
          created_at: string;
          id: string;
          organization_id: string | null;
          thumbnail_url: string | null;
          title: string | null;
          video_id: string | null;
        };
        Insert: {
          added_profile_id?: string | null;
          channel_title?: string | null;
          comment?: string | null;
          created_at?: string;
          id?: string;
          organization_id?: string | null;
          thumbnail_url?: string | null;
          title?: string | null;
          video_id?: string | null;
        };
        Update: {
          added_profile_id?: string | null;
          channel_title?: string | null;
          comment?: string | null;
          created_at?: string;
          id?: string;
          organization_id?: string | null;
          thumbnail_url?: string | null;
          title?: string | null;
          video_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_video_added_profile_id_fkey";
            columns: ["added_profile_id"];
            isOneToOne: false;
            referencedRelation: "profile";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_video_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organization";
            referencedColumns: ["id"];
          }
        ];
      };
      user_website: {
        Row: {
          added_user_id: string | null;
          created_at: string;
          description: string | null;
          favicon_url: string | null;
          id: string;
          image_url: string | null;
          title: string | null;
          url: string | null;
        };
        Insert: {
          added_user_id?: string | null;
          created_at?: string;
          description?: string | null;
          favicon_url?: string | null;
          id?: string;
          image_url?: string | null;
          title?: string | null;
          url?: string | null;
        };
        Update: {
          added_user_id?: string | null;
          created_at?: string;
          description?: string | null;
          favicon_url?: string | null;
          id?: string;
          image_url?: string | null;
          title?: string | null;
          url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_website_added_user_id_fkey";
            columns: ["added_user_id"];
            isOneToOne: false;
            referencedRelation: "profile";
            referencedColumns: ["id"];
          }
        ];
      };
      user_website_project: {
        Row: {
          id: string;
          project_id: string;
          website_id: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          website_id: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          website_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_website_project_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "project";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_website_project_website_id_fkey";
            columns: ["website_id"];
            isOneToOne: false;
            referencedRelation: "user_website";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      accept_project_invite: {
        Args: { input_invite_id: string; input_accepted_by: string };
        Returns: Json;
      };
      add_meeting_participant: {
        Args: { input_meeting_id: string; input_user_id: string };
        Returns: Json;
      };
      add_project_member: {
        Args: {
          input_project_id: string;
          input_profile_id: string;
          input_role: string;
          input_created_by: string;
        };
        Returns: Json;
      };
      add_project_website: {
        Args: {
          input_url: string;
          input_title: string;
          input_favicon_url: string;
          input_image_url: string;
          input_description: string;
          input_project_id: string;
          input_added_by: string;
        };
        Returns: Json;
      };
      convert_task_to_draft: {
        Args: { input_task_id: string; input_department_id: string };
        Returns: undefined;
      };
      create_project: {
        Args: {
          input_project_name: string;
          input_profile_id: string;
          input_description?: string;
        };
        Returns: undefined;
      };
      create_project_invite: {
        Args: {
          input_project_id: string;
          input_email: string;
          input_name: string;
          input_role: string;
          input_created_by: string;
        };
        Returns: Json;
      };
      create_project_meeting: {
        Args: {
          input_name: string;
          input_project_id: string;
          input_start_time: string;
          input_end_time: string;
          input_participant_ids: string[];
          input_created_by: string;
        };
        Returns: Json;
      };
      create_story: {
        Args: {
          input_project_id: string;
          input_story_name: string;
          input_profile_id: string;
          input_start_date?: string;
          input_end_date?: string;
          input_status?: Database["public"]["Enums"]["story_status"];
          input_index?: number;
        };
        Returns: string;
      };
      delete_project_invite: {
        Args: { input_invite_id: string };
        Returns: Json;
      };
      delete_project_meeting: {
        Args: { input_meeting_id: string };
        Returns: Json;
      };
      delete_story: {
        Args: { input_story_id: string };
        Returns: undefined;
      };
      get_all_pending_invites_for_user: {
        Args: { input_email: string };
        Returns: Json;
      };
      get_course: {
        Args: { input_course_id: string };
        Returns: {
          id: string;
          created_at: string;
          name: string;
        }[];
      };
      get_job: {
        Args: { input_job_id: string };
        Returns: Record<string, unknown>;
      };
      get_pending_project_invites: {
        Args: { input_project_id: string };
        Returns: Json;
      };
      get_project: {
        Args: { input_project_id: string };
        Returns: Json;
      };
      get_project_meeting: {
        Args: { input_meeting_id: string };
        Returns: Json;
      };
      get_story: {
        Args: { input_story_id: string };
        Returns: Json;
      };
      get_user_project: {
        Args: { input_project_id: string };
        Returns: Record<string, unknown>;
      };
      get_user_website: {
        Args: { input_website_id: string };
        Returns: Json;
      };
      list_admin_projects: {
        Args: { input_profile_id: string };
        Returns: {
          id: string;
          name: string;
        }[];
      };
      list_all_users: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      list_competitions: {
        Args: Record<PropertyKey, never>;
        Returns: {
          id: string;
          name: string;
          organizator: string;
          start_date: string;
          end_date: string;
          location: string;
          image_url: string;
          visible_date_range: string;
          description: string;
          apply_date: string;
          link: string;
        }[];
      };
      list_courses: {
        Args: Record<PropertyKey, never>;
        Returns: {
          id: string;
          created_at: string;
          name: string;
        }[];
      };
      list_epics: {
        Args: { input_department_id?: string };
        Returns: {
          id: string;
          name: string;
          department_id: string;
        }[];
      };
      list_events: {
        Args: Record<PropertyKey, never>;
        Returns: {
          id: string;
          name: string;
          organizator: string;
          start_date: string;
          end_date: string;
          location: string;
          image_url: string;
          visible_date_range: string;
          description: string;
        }[];
      };
      list_ideas: {
        Args: Record<PropertyKey, never>;
        Returns: {
          id: string;
          text: string;
          image_url: string;
          is_active: boolean;
          created_user: Json;
          organization: Json;
        }[];
      };
      list_jobs: {
        Args: { input_profile_id: string };
        Returns: {
          id: string;
          name: string;
          organization_name: string;
          organization_image_url: string;
          type: Database["public"]["Enums"]["job_type"];
          description: string;
          is_applied: boolean;
        }[];
      };
      list_organization_projects: {
        Args: { input_organization_id: string };
        Returns: {
          id: string;
          name: string;
        }[];
      };
      list_profile_fields: {
        Args: { input_profile_id?: string };
        Returns: {
          id: string;
          name: string;
          created_at: string;
        }[];
      };
      list_project_department_ideas: {
        Args: { input_project_id: string };
        Returns: {
          id: string;
          text: string;
          department_id: string;
          status: string;
          owner_user: Json;
        }[];
      };
      list_project_department_tasks: {
        Args: { input_project_id: string };
        Returns: {
          id: string;
          created_at: string;
          text: string;
          status: string;
          department_id: string;
        }[];
      };
      list_project_departments: {
        Args: { input_project_id: string };
        Returns: {
          id: string;
          created_at: string;
          name: string;
        }[];
      };
      list_project_meetings: {
        Args: { input_project_id: string };
        Returns: {
          id: string;
          name: string;
          project_id: string;
          start_time: string;
          end_time: string;
          participants: Json;
        }[];
      };
      list_project_members: {
        Args: { input_project_id: string };
        Returns: {
          id: string;
          name: string;
          role: string;
        }[];
      };
      list_project_stories: {
        Args: { input_project_id: string };
        Returns: {
          id: string;
          created_at: string;
          title: string;
          items: string[];
          item_images: string[];
          story_users: Json;
          start_date: string;
          end_date: string;
          status: Database["public"]["Enums"]["story_status"];
          index: number;
        }[];
      };
      list_project_story_tasks: {
        Args: { input_story_id: string };
        Returns: {
          id: string;
          created_at: string;
          formated_text: string;
          plain_text: string;
          is_finished: boolean;
          story_name: string;
          assigned_user: Json;
          story_id: string;
          date: string;
          task_group: string;
        }[];
      };
      list_project_transactions: {
        Args: { input_project_id: string };
        Returns: {
          id: string;
          created_at: string;
          amount: number;
          title: string;
        }[];
      };
      list_projects: {
        Args: { input_profile_id?: string };
        Returns: {
          id: string;
          name: string;
          description: string;
          image_url: string;
          is_admin: boolean;
        }[];
      };
      list_story_items: {
        Args: { input_story_id: string };
        Returns: {
          id: string;
          created_at: string;
          text: string;
          is_finished: boolean;
        }[];
      };
      list_user_events: {
        Args: { input_profile_id?: string };
        Returns: {
          id: string;
          name: string;
          image_url: string;
          location: string;
          organizator: string;
          start_date: string;
          end_date: string;
          description: string;
          visible_date_range: string;
          time_group: string;
          owner_name: string;
          owner_image_url: string;
          is_approved: boolean;
        }[];
      };
      list_user_panels: {
        Args: { input_profile_id: string };
        Returns: {
          id: string;
          name: string;
          type: string;
          image_url: string;
        }[];
      };
      list_user_project_stories: {
        Args: { input_profile_id: string; input_project_id: string };
        Returns: {
          id: string;
          created_at: string;
          title: string;
          secondary_title: string;
          items: string[];
          story_users: Json;
          extra_text: string;
        }[];
      };
      list_user_projects: {
        Args: { input_profile_id?: string };
        Returns: {
          id: string;
          name: string;
          description: string;
          created_at: string;
          field_name: string;
          user_name: string;
          user_image_url: string;
        }[];
      };
      list_user_story_tasks: {
        Args: { input_story_id: string; input_profile_id: string };
        Returns: {
          id: string;
          created_at: string;
          formated_text: string;
          plain_text: string;
          is_finished: boolean;
          story_name: string;
          story_id: string;
          date: string;
          task_group: string;
        }[];
      };
      list_user_videos: {
        Args: { input_profile_id?: string };
        Returns: {
          id: string;
          video_id: string;
          title: string;
          channel_title: string;
          thumbnail_url: string;
          added_at: string;
          owner_name: string;
          owner_image_url: string;
          is_approved: boolean;
        }[];
      };
      list_user_websites: {
        Args: { input_project_id?: string };
        Returns: {
          id: string;
          url: string;
          title: string;
          favicon_url: string;
          image_url: string;
          description: string;
          added_user_id: string;
          added_user_name: string;
          added_user_image_url: string;
          project_ids: string[];
        }[];
      };
      list_user_workspaces: {
        Args: { input_profile_id: string };
        Returns: {
          image_url: string;
          project_id: string;
          project_name: string;
          project_tasks: string[];
          project_extra_text: string;
        }[];
      };
      remove_meeting_participant: {
        Args: { input_meeting_id: string; input_user_id: string };
        Returns: Json;
      };
      remove_project_member: {
        Args: { input_project_id: string; input_profile_id: string };
        Returns: Json;
      };
      update_project: {
        Args: {
          input_project_id: string;
          input_project_name?: string;
          input_description?: string;
          input_image_url?: string;
          input_is_public?: boolean;
        };
        Returns: undefined;
      };
      update_project_invite: {
        Args: {
          input_invite_id: string;
          input_name?: string;
          input_role?: string;
          input_updated_by?: string;
        };
        Returns: Json;
      };
      update_project_meeting: {
        Args: {
          input_meeting_id: string;
          input_name?: string;
          input_start_time?: string;
          input_end_time?: string;
          input_updated_by?: string;
        };
        Returns: Json;
      };
      update_story: {
        Args: {
          input_story_id: string;
          input_story_name?: string;
          input_start_date?: string;
          input_end_date?: string;
          input_status?: Database["public"]["Enums"]["story_status"];
          input_index?: number;
        };
        Returns: undefined;
      };
      update_user_website: {
        Args: {
          input_website_id: string;
          input_url?: string;
          input_title?: string;
          input_favicon_url?: string;
          input_image_url?: string;
          input_description?: string;
          input_updated_by?: string;
        };
        Returns: Json;
      };
    };
    Enums: {
      department_item_type: "Task" | "Idea";
      department_task_status: "Important" | "Later" | "Closed";
      idea_user_type: "Owner" | "Approved" | "None";
      job_type: "work" | "freelance" | "intern";
      link_type: "Github Repo" | "Live Website";
      project_role: "Admin" | "Member";
      story_status: "Todo" | "InProgress" | "Done";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]) | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] & Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] & Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      department_item_type: ["Task", "Idea"],
      department_task_status: ["Important", "Later", "Closed"],
      idea_user_type: ["Owner", "Approved", "None"],
      job_type: ["work", "freelance", "intern"],
      link_type: ["Github Repo", "Live Website"],
      project_role: ["Admin", "Member"],
      story_status: ["Todo", "InProgress", "Done"]
    }
  }
} as const;
