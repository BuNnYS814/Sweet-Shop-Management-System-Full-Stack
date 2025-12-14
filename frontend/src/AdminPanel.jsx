import { useState, useEffect } from 'react';
import { sweetsAPI } from './api';

function AdminPanel({ user, onLogout, colors }) {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: '', price: '', quantity: '' });
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadSweets();
  }, []);

  const loadSweets = async () => {
    try {
      setLoading(true);
      setMessage('');
      const data = await sweetsAPI.getAll();
      setSweets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading sweets:', error);
      setMessage(`Error: ${error.response?.data?.detail || 'Failed to load sweets'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      if (editingSweet) {
        await sweetsAPI.update(editingSweet.id, {
          name: formData.name,
          category: formData.category,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity)
        });
        setMessage('✅ Sweet updated successfully!');
      } else {
        await sweetsAPI.create({
          name: formData.name,
          category: formData.category,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity)
        });
        setMessage('✅ Sweet created successfully!');
      }
      setShowForm(false);
      setEditingSweet(null);
      setFormData({ name: '', category: '', price: '', quantity: '' });
      loadSweets();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.detail || 'Operation failed. Please try again.'}`);
      setTimeout(() => setMessage(''), 4000);
    } finally {
      setProcessing(false);
    }
  };

  const handleEdit = (sweet) => {
    setEditingSweet(sweet);
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString()
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sweet? This action cannot be undone.')) return;
    setProcessing(true);
    try {
      await sweetsAPI.delete(id);
      setMessage('✅ Sweet deleted successfully!');
      loadSweets();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.detail || 'Delete failed. Please try again.'}`);
      setTimeout(() => setMessage(''), 4000);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 20px',
        background: colors.white,
        borderRadius: '16px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔧</div>
        <div style={{ color: colors.primary, fontSize: '18px', fontWeight: '500' }}>
          Loading admin panel...
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      background: colors.white,
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      minHeight: 'calc(100vh - 40px)'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: `2px solid ${colors.border}`
      }}>
        <div>
          <h1 style={{ 
            color: colors.primary, 
            margin: 0,
            fontSize: '2rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>🔧</span> Admin Panel
          </h1>
          <p style={{ color: colors.textLight, margin: '8px 0 0 0', fontSize: '14px' }}>
            Manage your sweet shop inventory
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingSweet(null);
              setFormData({ name: '', category: '', price: '', quantity: '' });
              if (!showForm) window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={processing}
            style={{
              padding: '10px 20px',
              background: showForm ? colors.textLight : colors.success,
              color: colors.white,
              border: 'none',
              borderRadius: '8px',
              cursor: processing ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s',
              boxShadow: showForm ? 'none' : `0 2px 8px ${colors.success}40`
            }}
          >
            {showForm ? '✕ Cancel' : '+ Add Sweet'}
          </button>
          <button
            onClick={onLogout}
            style={{
              padding: '10px 20px',
              background: colors.danger,
              color: colors.white,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s',
              boxShadow: `0 2px 8px ${colors.danger}40`
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div style={{
          padding: '14px 20px',
          marginBottom: '24px',
          background: message.includes('✅') ? `${colors.success}15` : `${colors.danger}15`,
          color: message.includes('✅') ? colors.success : colors.danger,
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: '500',
          border: `1px solid ${message.includes('✅') ? colors.success : colors.danger}40`
        }}>
          {message}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div style={{
          background: colors.light,
          padding: '30px',
          borderRadius: '12px',
          marginBottom: '30px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          border: `2px solid ${colors.primary}20`
        }}>
          <h2 style={{ marginTop: 0, color: colors.dark, marginBottom: '20px' }}>
            {editingSweet ? '✏️ Edit Sweet' : '➕ Add New Sweet'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: colors.text, fontWeight: '500' }}>
                Sweet Name
              </label>
              <input
                type="text"
                placeholder="e.g., Chocolate Bar"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={processing}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `2px solid ${colors.border}`,
                  borderRadius: '8px',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = colors.primary}
                onBlur={(e) => e.target.style.borderColor = colors.border}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: colors.text, fontWeight: '500' }}>
                Category
              </label>
              <input
                type="text"
                placeholder="e.g., Chocolate, Gummies, Hard Candy"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                disabled={processing}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `2px solid ${colors.border}`,
                  borderRadius: '8px',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = colors.primary}
                onBlur={(e) => e.target.style.borderColor = colors.border}
              />
            </div>
            <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: colors.text, fontWeight: '500' }}>
                  Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  disabled={processing}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${colors.border}`,
                    borderRadius: '8px',
                    fontSize: '15px',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = colors.primary}
                  onBlur={(e) => e.target.style.borderColor = colors.border}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: colors.text, fontWeight: '500' }}>
                  Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                  disabled={processing}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${colors.border}`,
                    borderRadius: '8px',
                    fontSize: '15px',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = colors.primary}
                  onBlur={(e) => e.target.style.borderColor = colors.border}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={processing}
              style={{
                padding: '12px 30px',
                background: processing ? colors.textLight : `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                color: colors.white,
                border: 'none',
                borderRadius: '8px',
                cursor: processing ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '15px',
                transition: 'all 0.2s',
                boxShadow: processing ? 'none' : `0 4px 12px ${colors.primary}40`
              }}
            >
              {processing ? 'Processing...' : (editingSweet ? '💾 Update Sweet' : '✨ Create Sweet')}
            </button>
          </form>
        </div>
      )}

      {/* Sweets Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        {sweets.map(sweet => (
          <div key={sweet.id} style={{
            background: colors.white,
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: `2px solid ${colors.border}`,
            transition: 'all 0.3s',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
          }}
          >
            <h3 style={{ margin: '0 0 12px 0', color: colors.dark, fontSize: '20px', fontWeight: '600' }}>
              {sweet.name}
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
              padding: '6px 12px',
              background: colors.light,
              borderRadius: '20px',
              width: 'fit-content',
              fontSize: '13px',
              color: colors.textLight,
              fontWeight: '500'
            }}>
              <span>🏷️</span> {sweet.category}
            </div>
            <div style={{
              marginBottom: '16px',
              padding: '16px',
              background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)`,
              borderRadius: '8px',
              border: `1px solid ${colors.primary}20`
            }}>
              <div style={{
                color: colors.primary,
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '4px'
              }}>
                ${parseFloat(sweet.price).toFixed(2)}
              </div>
              <div style={{
                color: colors.textLight,
                fontSize: '13px',
                fontWeight: '500'
              }}>
                Stock: <strong style={{ color: sweet.quantity > 0 ? colors.success : colors.danger }}>
                  {sweet.quantity}
                </strong>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleEdit(sweet)}
                disabled={processing}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: colors.warning,
                  color: colors.white,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: processing ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                  opacity: processing ? 0.6 : 1
                }}
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(sweet.id)}
                disabled={processing}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: colors.danger,
                  color: colors.white,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: processing ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                  opacity: processing ? 0.6 : 1
                }}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {sweets.length === 0 && !loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          background: colors.light,
          borderRadius: '12px',
          border: `2px dashed ${colors.border}`
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🍭</div>
          <h3 style={{ color: colors.dark, marginBottom: '12px' }}>No sweets in inventory</h3>
          <p style={{ color: colors.textLight, marginBottom: '24px' }}>
            Get started by adding your first sweet!
          </p>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
