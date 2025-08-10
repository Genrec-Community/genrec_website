import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Users, 
  MessageSquare, 
  Mail, 
  Star, 
  TrendingUp, 
  Download,
  Search,
  Filter,
  Calendar,
  BarChart3,
  Eye,
  RefreshCw
} from 'lucide-react';
import apiService from '../services/api';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [dashboardResponse, conversationsResponse, contactsResponse, feedbackResponse] = await Promise.all([
        apiService.getDashboard(),
        apiService.getConversations(1, 10),
        apiService.getContacts(1, 10),
        apiService.getAllFeedback(1, 10)
      ]);

      setDashboardData(dashboardResponse.data);
      setConversations(conversationsResponse.data);
      setContacts(contactsResponse.data);
      setFeedback(feedbackResponse.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (type) => {
    try {
      const response = await apiService.exportData(type, 'csv');
      // Handle CSV download
      const blob = new Blob([response], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `genrec-${type}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      new: 'bg-blue-500',
      in_progress: 'bg-yellow-500',
      completed: 'bg-green-500',
      cancelled: 'bg-red-500'
    };
    return (
      <Badge className={`${statusColors[status] || 'bg-gray-500'} text-white`}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 10 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-yellow-400 animate-spin mx-auto mb-4" />
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400">Genrec AI Customer Data Management</p>
          </div>
          <div className="flex space-x-4">
            <Button onClick={loadDashboardData} variant="outline" className="border-gray-600">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => exportData('all')} className="bg-yellow-600 hover:bg-yellow-700">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          {['overview', 'conversations', 'contacts', 'feedback'].map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              variant={activeTab === tab ? 'default' : 'outline'}
              className={activeTab === tab ? 'bg-yellow-600' : 'border-gray-600'}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && dashboardData && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Conversations</CardTitle>
                  <MessageSquare className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{dashboardData.conversations.total_conversations}</div>
                  <p className="text-xs text-gray-400">
                    +{dashboardData.conversations.today_conversations} today
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Contacts</CardTitle>
                  <Mail className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{dashboardData.contacts.total_contacts}</div>
                  <p className="text-xs text-gray-400">
                    +{dashboardData.contacts.today_contacts} today
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{dashboardData.users.total_users}</div>
                  <p className="text-xs text-gray-400">
                    +{dashboardData.users.new_today} new today
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Avg Rating</CardTitle>
                  <Star className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {dashboardData.feedback.average_rating ? dashboardData.feedback.average_rating.toFixed(1) : 'N/A'}
                  </div>
                  <p className="text-xs text-gray-400">
                    {dashboardData.feedback.total_feedback} total feedback
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Feature Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Contact Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-300">
                      Manage all customer inquiries and project requests. Track contact status from initial inquiry to completion.
                    </p>
                    <div className="flex justify-between">
                      <span className="text-gray-400">New Contacts</span>
                      <span className="text-blue-400">{dashboardData.contacts.new_contacts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">In Progress</span>
                      <span className="text-yellow-400">{dashboardData.contacts.in_progress_contacts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Completed</span>
                      <span className="text-green-400">{dashboardData.contacts.completed_contacts}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Conversation System</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-300">
                      AI-powered chatbot conversations with customers. Collect feedback and improve customer experience.
                    </p>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Conversations</span>
                      <span className="text-blue-400">{dashboardData.conversations.total_conversations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Average Rating</span>
                      <span className="text-yellow-400">
                        {dashboardData.feedback.average_rating ? dashboardData.feedback.average_rating.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
        {activeTab !== 'overview' && (
          <div className="text-center py-12">
            <p className="text-gray-400">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} view coming soon...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This section will show detailed {activeTab} management interface.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
