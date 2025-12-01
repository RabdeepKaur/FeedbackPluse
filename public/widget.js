(function() {
  'use strict';

  // Get configuration from script tag
  const script = document.currentScript || document.querySelector('script[data-project]');
  if (!script) {
    console.error('Feedback widget: Script tag not found');
    return;
  }

  const PROJECT_KEY = script.getAttribute('data-project');
  const API_URL = script.getAttribute('data-api-url') || window.location.origin;
  const POSITION = script.getAttribute('data-position') || 'bottom-right';

  if (!PROJECT_KEY) {
    console.error('Feedback widget: data-project attribute is required');
    return;
  }

  // Create widget button
  function createButton() {
    const button = document.createElement('button');
    button.id = 'feedback-widget-button';
    button.title = 'Send Feedback';
    button.innertext='Feedback';
      
    
    
    // Styles
    Object.assign(button.style, {
      position: 'fixed',
      bottom: POSITION.includes('bottom') ? '20px' : 'auto',
      top: POSITION.includes('top') ? '20px' : 'auto',
      right: POSITION.includes('right') ? '20px' : 'auto',
      left: POSITION.includes('left') ? '20px' : 'auto',
      width: '60px',
      height: '60px',
      borderRadius: '20%',
      backgroundColor: '#FFFFFF',
      color: 'black',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: '999999',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
    });

    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.1)';
      button.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
      button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    });

    button.addEventListener('click', openModal);

    document.body.appendChild(button);
  }

  // Create modal
  function createModal() {
    const overlay = document.createElement('div');
    overlay.id = 'feedback-widget-overlay';
    
    Object.assign(overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: '1000000',
      display: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.2s ease',
    });

    const modal = document.createElement('div');
    modal.id = 'feedback-widget-modal';
    
    Object.assign(modal.style, {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      animation: 'slideUp 0.3s ease',
    });

    modal.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="margin: 0; font-size: 24px; font-weight: 600; color: #1f2937;">Send Feedback</h2>
        <button id="feedback-close-btn" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280; padding: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 4px;" onmouseover="this.style.backgroundColor='#f3f4f6'" onmouseout="this.style.backgroundColor='transparent'">×</button>
      </div>

      <form id="feedback-form">
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 14px;">Feedback Type *</label>
          <div style="display: flex; gap: 8px;">
            <button type="button" class="feedback-type-btn" data-type="BUG" style="flex: 1; padding: 10px; border: 2px solid #e5e7eb; background: white; border-radius: 8px; cursor: pointer; font-weight: 500; transition: all 0.2s; color:black">🐛 Bug</button>
            <button type="button" class="feedback-type-btn" data-type="FEATURE" style="flex: 1; padding: 10px; border: 2px solid #e5e7eb; background: white; border-radius: 8px; cursor: pointer; font-weight: 500; transition: all 0.2s;color:black">💡 Feature</button>
            <button type="button" class="feedback-type-btn" data-type="OTHER" style="flex: 1; padding: 10px; border: 2px solid #e5e7eb; background: white; border-radius: 8px; cursor: pointer; font-weight: 500; transition: all 0.2s; color:black">💬 Other</button>
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <label for="feedback-message" style="display: block; margin-bottom: 8px; font-weight: 500; color: black; font-size: 14px;">Message *</label>
          <textarea id="feedback-message" name="message" required rows="4" placeholder="Tell us what's on your mind..." style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; font-family: inherit; resize: vertical; color:black" onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='#e5e7eb'"></textarea>
        </div>

        <div style="margin-bottom: 16px;">
          <label for="feedback-email" style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 14px;">Email (optional)</label>
          <input type="email" id="feedback-email" name="email" placeholder="your@email.com" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; font-family: inherit;" onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='#e5e7eb'">
        </div>

        <div style="margin-bottom: 16px;">
          <label for="feedback-name" style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 14px;">Name (optional)</label>
          <input type="text" id="feedback-name" name="name" placeholder="Your name" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; font-family: inherit;" onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='#e5e7eb'">
        </div>

        <div id="feedback-error" style="display: none; padding: 12px; background-color: #fef2f2; border: 1px solid #fecaca; color: #991b1b; border-radius: 8px; margin-bottom: 16px; font-size: 14px;"></div>
        <div id="feedback-success" style="display: none; padding: 12px; background-color: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; border-radius: 8px; margin-bottom: 16px; font-size: 14px;"></div>

        <button type="submit" id="feedback-submit-btn" style="width: 100%; padding: 12px; background-color: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 16px; cursor: pointer; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#2563eb'" onmouseout="this.style.backgroundColor='#3b82f6'">
          Send Feedback
        </button>
      </form>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    // Event listeners
    let selectedType = 'OTHER';

    document.getElementById('feedback-close-btn').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    // Type selection
    document.querySelectorAll('.feedback-type-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.feedback-type-btn').forEach(b => {
          b.style.borderColor = '#e5e7eb';
          b.style.backgroundColor = 'white';
        });
        this.style.borderColor = '#3b82f6';
        this.style.backgroundColor = '#eff6ff';
        selectedType = this.getAttribute('data-type');
      });
    });

    // Form submission
    document.getElementById('feedback-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('feedback-submit-btn');
      const errorDiv = document.getElementById('feedback-error');
      const successDiv = document.getElementById('feedback-success');
      
      errorDiv.style.display = 'none';
      successDiv.style.display = 'none';
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      const formData = {
        projectKey: PROJECT_KEY,
        type: selectedType,
        message: document.getElementById('feedback-message').value,
        userEmail: document.getElementById('feedback-email').value || null,
        userName: document.getElementById('feedback-name').value || null,
        pageUrl: window.location.href,
        userAgent: navigator.userAgent,
      };

      try {
        const response = await fetch(`${API_URL}/api/feedback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          successDiv.textContent = 'Thank you! Your feedback has been sent.';
          successDiv.style.display = 'block';
          document.getElementById('feedback-form').reset();
          
          setTimeout(() => {
            closeModal();
          }, 2000);
        } else {
          throw new Error(data.error || 'Failed to send feedback');
        }
      } catch (error) {
        errorDiv.textContent = error.message || 'Something went wrong. Please try again.';
        errorDiv.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Feedback';
      }
    });
  }

  function openModal() {
    const overlay = document.getElementById('feedback-widget-overlay');
    if (overlay) {
      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    const overlay = document.getElementById('feedback-widget-overlay');
    if (overlay) {
      overlay.style.display = 'none';
      document.body.style.overflow = 'auto';
      
      // Reset form
      const form = document.getElementById('feedback-form');
      if (form) form.reset();
      
      const errorDiv = document.getElementById('feedback-error');
      const successDiv = document.getElementById('feedback-success');
      if (errorDiv) errorDiv.style.display = 'none';
      if (successDiv) successDiv.style.display = 'none';
    }
  }

  // Initialize widget
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        createButton();
        createModal();
      });
    } else {
      createButton();
      createModal();
    }
  }

  init();
})();