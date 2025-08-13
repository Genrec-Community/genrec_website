// Frontend Supabase client (optional - for direct database access)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Using API service instead.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Real-time subscription helpers
export const subscribeToContacts = (callback) => {
  if (!supabase) return null;
  
  return supabase
    .channel('contacts')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'contacts' }, 
      callback
    )
    .subscribe();
};

export const subscribeToConversations = (callback) => {
  if (!supabase) return null;
  
  return supabase
    .channel('conversations')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'conversations' }, 
      callback
    )
    .subscribe();
};

export const subscribeToMessages = (sessionId, callback) => {
  if (!supabase) return null;
  
  return supabase
    .channel(`messages:${sessionId}`)
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `session_id=eq.${sessionId}`
      }, 
      callback
    )
    .subscribe();
};

// Direct database operations (alternative to API)
export const directDbOperations = {
  // Get contacts directly from Supabase
  async getContacts(page = 1, limit = 20) {
    if (!supabase) throw new Error('Supabase not initialized');
    
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, error, count } = await supabase
      .from('contacts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
      
    if (error) throw error;
    return { data, count, page, limit };
  },

  // Get real-time conversation messages
  async getConversationMessages(sessionId) {
    if (!supabase) throw new Error('Supabase not initialized');
    
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    return data;
  }
};

export default supabase;
