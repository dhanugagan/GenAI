/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Wallet, 
  Plus, 
  Sparkles, 
  Trash2, 
  Edit3, 
  Filter, 
  CheckCircle, 
  AlertTriangle,
  TrendingDown,
  DollarSign,
  PieChart,
  ArrowUpDown
} from 'lucide-react';
import { BudgetItem, BudgetCategory, EventPlan } from '../types';
import { formatCurrency } from '../utils/formatters';

interface BudgetTabProps {
  event: EventPlan;
  onUpdateEvent: (updated: EventPlan) => void;
}

const CATEGORY_NAMES: Record<BudgetCategory, string> = {
  venue: 'Venue & Facilities',
  catering: 'Catering & Beverages',
  decor_rentals: 'Decor & Rentals',
  photo_video: 'Photography & Videography',
  entertainment: 'Music & Entertainment',
  attire_beauty: 'Attire & Beauty',
  invitations_gifts: 'Invitations & Favors',
  logistics_permits: 'Logistics, Insurance & Permits',
  contingency: 'Contingency Reserve',
};

const CATEGORY_COLORS: Record<BudgetCategory, string> = {
  venue: 'bg-rose-500',
  catering: 'bg-amber-500',
  decor_rentals: 'bg-emerald-500',
  photo_video: 'bg-indigo-500',
  entertainment: 'bg-purple-500',
  attire_beauty: 'bg-pink-500',
  invitations_gifts: 'bg-cyan-500',
  logistics_permits: 'bg-slate-500',
  contingency: 'bg-orange-500',
};

export const BudgetTab: React.FC<BudgetTabProps> = ({ event, onUpdateEvent }) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Add/Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [formCategory, setFormCategory] = useState<BudgetCategory>('catering');
  const [formName, setFormName] = useState('');
  const [formEstimated, setFormEstimated] = useState<number>(0);
  const [formActual, setFormActual] = useState<number>(0);
  const [formPaid, setFormPaid] = useState<number>(0);
  const [formNotes, setFormNotes] = useState('');
  const [formStatus, setFormStatus] = useState<'planned' | 'deposit_paid' | 'paid_in_full'>('planned');

  // AI Optimizer State
  const [isAiOptimizerOpen, setIsAiOptimizerOpen] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [optimizationGoal, setOptimizationGoal] = useState<string>('save_15_percent');

  const totalBudget = event.totalBudget || 0;
  const totalAllocated = event.budgetItems.reduce((acc, item) => acc + (item.actualCost || item.estimatedCost || 0), 0);
  const totalPaid = event.budgetItems.reduce((acc, item) => acc + (item.paidAmount || 0), 0);
  const remainingBudget = totalBudget - totalAllocated;

  // Group by category
  const categoryTotals = Object.keys(CATEGORY_NAMES).map((catKey) => {
    const key = catKey as BudgetCategory;
    const items = event.budgetItems.filter(item => item.category === key);
    const total = items.reduce((acc, item) => acc + (item.actualCost || item.estimatedCost || 0), 0);
    const count = items.length;
    const percentage = totalBudget > 0 ? (total / totalBudget) * 100 : 0;
    return {
      category: key,
      label: CATEGORY_NAMES[key],
      total,
      count,
      percentage,
      color: CATEGORY_COLORS[key],
    };
  }).filter(c => c.total > 0 || c.count > 0);

  // Filter items
  const filteredItems = event.budgetItems.filter(item => {
    if (selectedCategoryFilter !== 'all' && item.category !== selectedCategoryFilter) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    return true;
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormCategory('venue');
    setFormName('');
    setFormEstimated(0);
    setFormActual(0);
    setFormPaid(0);
    setFormNotes('');
    setFormStatus('planned');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: BudgetItem) => {
    setEditingItem(item);
    setFormCategory(item.category);
    setFormName(item.name);
    setFormEstimated(item.estimatedCost);
    setFormActual(item.actualCost);
    setFormPaid(item.paidAmount);
    setFormNotes(item.notes || '');
    setFormStatus(item.status);
    setIsModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingItem) {
      const updatedList = event.budgetItems.map(item => {
        if (item.id === editingItem.id) {
          return {
            ...item,
            category: formCategory,
            name: formName.trim(),
            estimatedCost: Number(formEstimated) || 0,
            actualCost: Number(formActual) || 0,
            paidAmount: Number(formPaid) || 0,
            notes: formNotes.trim(),
            status: formStatus,
          };
        }
        return item;
      });
      onUpdateEvent({ ...event, budgetItems: updatedList });
    } else {
      const newItem: BudgetItem = {
        id: `b-${Date.now()}`,
        category: formCategory,
        name: formName.trim(),
        estimatedCost: Number(formEstimated) || 0,
        actualCost: Number(formActual) || Number(formEstimated) || 0,
        paidAmount: Number(formPaid) || 0,
        notes: formNotes.trim(),
        status: formStatus,
      };
      onUpdateEvent({ ...event, budgetItems: [...event.budgetItems, newItem] });
    }
    setIsModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    const updated = event.budgetItems.filter(item => item.id !== id);
    onUpdateEvent({ ...event, budgetItems: updated });
  };

  const handleRunAiOptimizer = async () => {
    setIsOptimizing(true);
    setAiAnalysis(null);
    try {
      const res = await fetch('/api/ai/optimize-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalBudget: event.totalBudget,
          currency: event.currency,
          items: event.budgetItems,
          goal: optimizationGoal,
          eventType: event.eventType,
        }),
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        setAiAnalysis(data.analysis);
      } else {
        setAiAnalysis('Could not optimize budget at this time.');
      }
    } catch (err: any) {
      setAiAnalysis(`Optimization error: ${err.message}`);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-serif-display font-bold text-slate-900 flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-rose-600" />
            <span>Budget & Financial Strategy</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track line items, analyze allocations, and optimize expenses with GenAI.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => {
              setIsAiOptimizerOpen(true);
              if (!aiAnalysis) handleRunAiOptimizer();
            }}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-700 hover:to-rose-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Budget Optimizer</span>
          </button>
          
          <button
            onClick={handleOpenAddModal}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-medium shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Target Budget Cap</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {formatCurrency(totalBudget, event.currency)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Established ceiling</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Committed / Allocated</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {formatCurrency(totalAllocated, event.currency)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {formatCurrency(totalPaid, event.currency)} actually paid so far
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Remaining Balance</p>
          <p className={`text-2xl font-bold mt-1 ${remainingBudget < 0 ? 'text-red-600' : 'text-emerald-700'}`}>
            {remainingBudget < 0 ? '-' : ''}{formatCurrency(Math.abs(remainingBudget), event.currency)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {remainingBudget < 0 ? 'Over target allocation' : 'Available for contingency or extras'}
          </p>
        </div>
      </div>

      {/* Category Breakdown visual cards */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-1.5">
            <PieChart className="w-4 h-4 text-slate-500" />
            <span>Category Allocations</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {categoryTotals.length} Active Categories
          </span>
        </div>

        {/* Visual Multi-Segment Bar */}
        <div className="w-full h-3 bg-slate-100 rounded-full flex overflow-hidden">
          {categoryTotals.map((cat, idx) => (
            <div
              key={idx}
              className={`${cat.color} h-full transition-all duration-300`}
              style={{ width: `${Math.min(100, cat.percentage)}%` }}
              title={`${cat.label}: ${formatCurrency(cat.total, event.currency)} (${cat.percentage.toFixed(1)}%)`}
            />
          ))}
        </div>

        {/* Category Pill Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
          {categoryTotals.map((cat) => (
            <div
              key={cat.category}
              onClick={() => setSelectedCategoryFilter(selectedCategoryFilter === cat.category ? 'all' : cat.category)}
              className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                selectedCategoryFilter === cat.category
                  ? 'border-rose-400 bg-rose-50/50 shadow-2xs'
                  : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className={`w-2.5 h-2.5 rounded-full ${cat.color} shrink-0`} />
                <span className="text-xs font-semibold text-slate-800 truncate">
                  {cat.label}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {formatCurrency(cat.total, event.currency)}
              </p>
              <p className="text-[10px] text-slate-500">
                {cat.percentage.toFixed(1)}% of total • {cat.count} items
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Table Filters */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Filter:</span>
            </span>

            {/* Category Filter */}
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-rose-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {Object.entries(CATEGORY_NAMES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-rose-500 cursor-pointer"
            >
              <option value="all">All Payment Statuses</option>
              <option value="planned">Planned (Unpaid)</option>
              <option value="deposit_paid">Deposit Paid</option>
              <option value="paid_in_full">Paid in Full</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing {filteredItems.length} of {event.budgetItems.length} expenses
          </div>
        </div>

        {/* Expense Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100/70 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Expense & Category</th>
                <th className="py-3 px-4 text-right">Estimated</th>
                <th className="py-3 px-4 text-right">Actual / Quoted</th>
                <th className="py-3 px-4 text-right">Paid</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                    No budget items found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="text-[11px] text-slate-500">
                          {CATEGORY_NAMES[item.category] || item.category}
                        </span>
                        {item.notes && (
                          <span className="text-[11px] text-slate-400 italic truncate max-w-xs">
                            — {item.notes}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-600">
                      {formatCurrency(item.estimatedCost, event.currency)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      {formatCurrency(item.actualCost || item.estimatedCost, event.currency)}
                    </td>
                    <td className="py-3 px-4 text-right text-emerald-700 font-medium">
                      {formatCurrency(item.paidAmount, event.currency)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          item.status === 'paid_in_full'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'deposit_paid'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 transition-colors"
                          title="Edit expense"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete expense"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Add / Edit Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-serif-display font-bold text-slate-900 mb-4">
              {editingItem ? 'Edit Budget Expense' : 'Add New Budget Expense'}
            </h3>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expense Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acoustic Trio Ceremony Music, Floral Centerpieces"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as BudgetCategory)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-rose-500 bg-white"
                  >
                    {Object.entries(CATEGORY_NAMES).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-rose-500 bg-white"
                  >
                    <option value="planned">Planned (Unpaid)</option>
                    <option value="deposit_paid">Deposit Paid</option>
                    <option value="paid_in_full">Paid in Full</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estimated ({event.currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formEstimated || ''}
                    onChange={(e) => setFormEstimated(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Actual / Quoted
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formActual || ''}
                    onChange={(e) => setFormActual(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Amount Paid
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formPaid || ''}
                    onChange={(e) => setFormPaid(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes & Details (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Deposit due 30 days prior, includes dishware and crew"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-rose-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Budget Optimizer Modal */}
      {isAiOptimizerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-indigo-700">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif-display font-bold text-lg text-slate-900">
                    GenAI Financial Optimizer
                  </h3>
                  <p className="text-xs text-slate-500">
                    Smart cost-cutting recommendations & market variance analysis
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAiOptimizerOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                &times;
              </button>
            </div>

            {/* Strategy Goal Selection */}
            <div className="py-3 flex flex-wrap items-center gap-2 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-700">Optimization Goal:</span>
              {[
                { id: 'save_15_percent', label: 'Trim 15% Budget' },
                { id: 'rebalance_luxury', label: 'Elevate Guest Experience' },
                { id: 'negotiation_leverage', label: 'Vendor Negotiation Leverage' },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => {
                    setOptimizationGoal(g.id);
                    handleRunAiOptimizer();
                  }}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                    optimizationGoal === g.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            {/* Analysis Output */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {isOptimizing ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm font-semibold text-slate-700">
                    Analyzing budget allocations with Gemini...
                  </p>
                  <p className="text-xs text-slate-400">
                    Cross-referencing venue, food & beverage ratios against standard market tiers.
                  </p>
                </div>
              ) : aiAnalysis ? (
                <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed whitespace-pre-wrap font-sans text-xs sm:text-sm">
                  {aiAnalysis}
                </div>
              ) : null}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={handleRunAiOptimizer}
                disabled={isOptimizing}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Re-analyze with Gemini</span>
              </button>
              <button
                onClick={() => setIsAiOptimizerOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs"
              >
                Close Optimizer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
