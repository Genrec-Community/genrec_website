const { supabase } = require('../config/supabase');

class DatabaseService {
  // Contact operations
  async createContact(contactData) {
    const { data, error } = await supabase
      .from('contacts')
      .insert([{
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        company: contactData.company,
        message: contactData.message,
        source: contactData.source || 'website',
        status: 'new',
        metadata: contactData.metadata || {}
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getContacts(page = 1, limit = 20, filters = {}) {
    let query = supabase
      .from('contacts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.source) {
      query = query.eq('source', filters.source);
    }
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data,
      count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    };
  }

  async updateContactStatus(id, status, notes) {
    const { data, error } = await supabase
      .from('contacts')
      .update({ 
        status, 
        notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Conversation operations
  async createConversation(conversationData) {
    const { data, error } = await supabase
      .from('conversations')
      .insert([{
        session_id: conversationData.sessionId,
        user_id: conversationData.userId,
        status: 'active',
        metadata: conversationData.metadata || {}
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async addMessage(messageData) {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        conversation_id: messageData.conversationId,
        session_id: messageData.sessionId,
        sender_type: messageData.senderType, // 'user' or 'bot'
        content: messageData.content,
        message_type: messageData.messageType || 'text',
        metadata: messageData.metadata || {}
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getConversation(sessionId) {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        messages (*)
      `)
      .eq('session_id', sessionId)
      .single();

    if (error) throw error;
    return data;
  }

  async getConversations(page = 1, limit = 20, filters = {}) {
    let query = supabase
      .from('conversations')
      .select('*, messages(count)', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data,
      count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    };
  }

  async endConversation(sessionId) {
    const { data, error } = await supabase
      .from('conversations')
      .update({ 
        status: 'ended',
        ended_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('session_id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Feedback operations
  async createFeedback(feedbackData) {
    const { data, error } = await supabase
      .from('feedback')
      .insert([{
        session_id: feedbackData.sessionId,
        conversation_id: feedbackData.conversationId,
        rating: feedbackData.rating,
        feedback_text: feedbackData.feedbackText,
        feedback_type: feedbackData.feedbackType || 'general',
        user_id: feedbackData.userId,
        metadata: feedbackData.metadata || {}
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getFeedback(page = 1, limit = 20, filters = {}) {
    let query = supabase
      .from('feedback')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.rating) {
      query = query.eq('rating', filters.rating);
    }
    if (filters.feedback_type) {
      query = query.eq('feedback_type', filters.feedback_type);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data,
      count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    };
  }

  // Interaction operations
  async createInteraction(interactionData) {
    const { data, error } = await supabase
      .from('interactions')
      .insert([{
        user_id: interactionData.userId,
        session_id: interactionData.sessionId,
        interaction_type: interactionData.interactionType,
        source: interactionData.source,
        data: interactionData.data || {},
        metadata: interactionData.metadata || {}
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Analytics operations
  async getDashboardStats() {
    const [
      contactsResult,
      conversationsResult,
      feedbackResult,
      interactionsResult
    ] = await Promise.all([
      supabase.from('contacts').select('*', { count: 'exact', head: true }),
      supabase.from('conversations').select('*', { count: 'exact', head: true }),
      supabase.from('feedback').select('rating', { count: 'exact' }),
      supabase.from('interactions').select('*', { count: 'exact', head: true })
    ]);

    // Get today's counts
    const today = new Date().toISOString().split('T')[0];
    const [
      todayContactsResult,
      todayConversationsResult
    ] = await Promise.all([
      supabase.from('contacts').select('*', { count: 'exact', head: true }).gte('created_at', today),
      supabase.from('conversations').select('*', { count: 'exact', head: true }).gte('created_at', today)
    ]);

    // Calculate feedback stats
    const feedbackData = feedbackResult.data || [];
    const avgRating = feedbackData.length > 0 
      ? feedbackData.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbackData.length 
      : 0;
    const positiveFeedback = feedbackData.filter(f => f.rating >= 8).length;
    const negativeFeedback = feedbackData.filter(f => f.rating <= 5).length;

    return {
      conversations: {
        total_conversations: conversationsResult.count || 0,
        today_conversations: todayConversationsResult.count || 0
      },
      contacts: {
        total_contacts: contactsResult.count || 0,
        today_contacts: todayContactsResult.count || 0,
        new_contacts: contactsResult.count || 0,
        in_progress_contacts: 0,
        completed_contacts: 0
      },
      feedback: {
        total_feedback: feedbackResult.count || 0,
        average_rating: avgRating,
        positive_feedback: positiveFeedback,
        negative_feedback: negativeFeedback,
        with_comments: feedbackData.filter(f => f.feedback_text).length
      },
      users: {
        total_users: contactsResult.count || 0,
        new_today: todayContactsResult.count || 0
      }
    };
  }
}

module.exports = new DatabaseService();
