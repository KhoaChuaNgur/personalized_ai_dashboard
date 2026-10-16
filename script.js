/**
 * ====================================================================
 * DỰ ÁN: PERSONALIZED TO-DO DASHBOARD (PRO VERSION - LEVEL 9-10)
 * VAI TRÒ: CHUYÊN GIA LẬP TRÌNH WEB FRONT-END & UI/UX ANIMATION
 * ====================================================================
 * NÂNG CẤP MỚI: TÍCH HỢP HIỆU ỨNG PHÁO HOA (CONFETTI / BUNG LỤA)
 * 1. Tích hợp hiệu ứng pháo hoa nhẹ nhàng qua canvas-confetti (kèm fallback Canvas thuần).
 * 2. Kích hoạt hiệu ứng bắn hoa giấy ngay tại vị trí con trỏ chuột click.
 * 3. Chỉ bắn khi chuyển từ "Chưa hoàn thành" sang "Hoàn thành" (hủy hoàn thành thì không bắn).
 * 4. Tự động dọn dẹp Canvas sau 1.5 - 2s, không gây rò rỉ bộ nhớ (memory leak).
 * 5. Thưởng lớn (Super Celebration) khi hoàn thành 100% tất cả công việc.
 * 6. Giữ trọn vẹn: Task Description, Accordion, Dark Mode, LocalStorage, Search & Realtime Clock.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==================================================================
  // 1. STORAGE MODULE: LƯU TRỮ VÀ KHÔI PHỤC VỚI LOCALSTORAGE
  // ==================================================================
  const StorageModule = (() => {
    const STORAGE_KEY_TASKS = 'taskflow_pro_tasks_v3';
    const STORAGE_KEY_THEME = 'taskflow_pro_theme';
    const STORAGE_KEY_USER = 'taskflow_pro_user';

    /**
     * Tải danh sách công việc từ LocalStorage với JSON.parse
     * @returns {Array|null}
     */
    function loadTasks() {
      try {
        const rawData = localStorage.getItem(STORAGE_KEY_TASKS);
        if (!rawData) return null;
        const parsed = JSON.parse(rawData);
        if (!Array.isArray(parsed)) return null;

        // Chuẩn hóa cấu trúc dữ liệu { id, title, description, completed, priority, createdAt }
        return parsed.map((item) => ({
          id: item.id || `task-${Date.now()}`,
          title: item.title || item.text || 'Công việc không tên',
          description: item.description || '',
          completed: Boolean(item.completed),
          priority: item.priority || 'medium',
          createdAt: item.createdAt || '12:00'
        }));
      } catch (err) {
        console.error('Lỗi khi đọc tasks từ LocalStorage:', err);
        return null;
      }
    }

    /**
     * Lưu danh sách công việc vào LocalStorage với JSON.stringify
     * @param {Array} tasks
     */
    function saveTasks(tasks) {
      try {
        localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
      } catch (err) {
        console.error('Lỗi khi lưu tasks vào LocalStorage:', err);
      }
    }

    function loadTheme() {
      return localStorage.getItem(STORAGE_KEY_THEME) || 'light';
    }

    function saveTheme(theme) {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    }

    function loadUserName() {
      return localStorage.getItem(STORAGE_KEY_USER) || 'Khoa';
    }

    function saveUserName(name) {
      localStorage.setItem(STORAGE_KEY_USER, name);
    }

    return {
      loadTasks,
      saveTasks,
      loadTheme,
      saveTheme,
      loadUserName,
      saveUserName
    };
  })();

  // ==================================================================
  // 2. THEME MODULE: QUẢN LÝ CHẾ ĐỘ DARK / LIGHT MODE
  // ==================================================================
  const ThemeModule = (() => {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeLabelText = document.getElementById('theme-label-text');
    let currentTheme = 'light';

    function applyTheme(theme) {
      currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      if (themeLabelText) {
        themeLabelText.textContent = theme === 'dark' ? 'Sáng' : 'Tối';
      }
      StorageModule.saveTheme(theme);
    }

    function toggle() {
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    }

    function init() {
      const savedTheme = StorageModule.loadTheme();
      applyTheme(savedTheme);

      if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggle);
      }
    }

    return { init, toggle };
  })();

  // ==================================================================
  // 3. CONFETTI MODULE: HIỆU ỨNG PHÁO HOA ĂN MỪNG (CANVAS ANIMATION)
  // ==================================================================
  const ConfettiModule = (() => {
    /**
     * Bắn pháo hoa bung lụa tại tọa độ click của con trỏ chuột
     * @param {number} clientX - Tọa độ X của click
     * @param {number} clientY - Tọa độ Y của click
     */
    function fireAt(clientX, clientY) {
      // Tính toán tỉ lệ vị trí con trỏ chuột trên màn hình (0.0 đến 1.0)
      const originX = clientX ? clientX / window.innerWidth : 0.5;
      const originY = clientY ? clientY / window.innerHeight : 0.5;

      // ƯU TIÊN 1: Sử dụng thư viện canvas-confetti nếu CDN tải thành công
      if (typeof window.confetti === 'function') {
        // Đợt 1: Bắn bung tỏa rực rỡ tại điểm click
        window.confetti({
          particleCount: 45,
          spread: 70,
          origin: { x: originX, y: originY },
          colors: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'],
          disableForReducedMotion: true,
          ticks: 150,
          scalar: 0.95
        });

        // Đợt 2: Thêm các hạt ánh sao phụ sau 90ms tạo độ sâu
        setTimeout(() => {
          window.confetti({
            particleCount: 25,
            spread: 100,
            angle: 90,
            origin: { x: originX, y: Math.max(0.05, originY - 0.04) },
            shapes: ['circle'],
            colors: ['#38bdf8', '#34d399', '#fbbf24', '#f43f5e'],
            scalar: 0.75,
            ticks: 120
          });
        }, 90);
      } else {
        // ƯU TIÊN 2: Fallback Canvas thuần không phụ thuộc thư viện ngoài (Offline safe)
        runFallbackCanvasConfetti(clientX, clientY);
      }
    }

    /**
     * Pháo hoa đại tiệc bắn từ 2 góc màn hình khi người dùng hoàn thành 100% công việc
     */
    function fireCelebration() {
      if (typeof window.confetti === 'function') {
        const count = 180;
        const defaults = { origin: { y: 0.75 } };

        function shoot(ratio, opts) {
          window.confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * ratio)
          });
        }

        shoot(0.25, { spread: 30, startVelocity: 50 });
        shoot(0.2, { spread: 60 });
        shoot(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        shoot(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        shoot(0.1, { spread: 120, startVelocity: 45 });
      }
    }

    /**
     * Fallback Canvas Confetti: Tạo canvas tạm thời, vẽ hạt hoa giấy chuyển động và tự dọn dẹp
     */
    function runFallbackCanvasConfetti(clientX, clientY) {
      const canvas = document.createElement('canvas');
      canvas.className = 'confetti-fallback-canvas';
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '99999';
      document.body.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles = [];
      const colors = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#ef4444'];
      const startX = clientX || canvas.width / 2;
      const startY = clientY || canvas.height / 2;

      for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 6 + 2;
        particles.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity - 2.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 6 + 4,
          alpha: 1,
          decay: Math.random() * 0.02 + 0.015
        });
      }

      function renderFrame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let hasActive = false;

        particles.forEach((p) => {
          if (p.alpha > 0) {
            hasActive = true;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.22; // Trọng lực nhẹ
            p.alpha -= p.decay;

            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
            ctx.restore();
          }
        });

        if (hasActive) {
          requestAnimationFrame(renderFrame);
        } else {
          // Tự động xóa Canvas khỏi DOM sau khi hiệu ứng kết thúc (tránh rò rỉ bộ nhớ)
          canvas.remove();
        }
      }

      requestAnimationFrame(renderFrame);
    }

    return { fireAt, fireCelebration };
  })();

  // ==================================================================
  // 4. TASK STORE: MÔ HÌNH DỮ LIỆU CÔNG VIỆC (CENTRAL STORE)
  // ==================================================================
  const TaskStore = (() => {
    const DEFAULT_TASKS = [
      {
        id: 'task-1',
        title: 'Hoàn thiện bản thiết kế Dashboard UI theo chuẩn HTML5 & CSS',
        description: 'Tối ưu hóa layout 2 cột Sidebar, hỗ trợ Dark Mode và kiểm tra độ tương thích trên thiết bị di động.',
        completed: true,
        priority: 'high',
        createdAt: '08:30'
      },
      {
        id: 'task-2',
        title: 'Bổ sung trường Mô tả công việc (Task Description)',
        description: 'Thêm trường nhập mô tả chi tiết, hiệu ứng Accordion thu gọn/mở rộng và lưu cấu trúc dữ liệu vào LocalStorage.',
        completed: false,
        priority: 'medium',
        createdAt: '09:15'
      },
      {
        id: 'task-3',
        title: 'Tích hợp hiệu ứng pháo hoa Confetti khi hoàn thành',
        description: 'Bắn hoa giấy bung lụa tại tọa độ click khi đánh dấu hoàn thành một công việc.',
        completed: false,
        priority: 'low',
        createdAt: '10:00'
      }
    ];

    let tasks = [];
    let statusFilter = 'all'; // 'all' | 'active' | 'completed'
    let priorityFilter = 'all'; // 'all' | 'high' | 'medium' | 'low'
    let searchQuery = '';

    function init() {
      const persisted = StorageModule.loadTasks();
      if (persisted !== null) {
        tasks = persisted;
      } else {
        tasks = [...DEFAULT_TASKS];
        StorageModule.saveTasks(tasks);
      }
    }

    function getAllTasks() {
      return [...tasks];
    }

    function getFilteredTasks() {
      return tasks.filter((task) => {
        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'active' && !task.completed) ||
          (statusFilter === 'completed' && task.completed);

        const matchesPriority =
          priorityFilter === 'all' || task.priority === priorityFilter;

        const q = searchQuery.toLowerCase();
        const matchesSearch =
          !q ||
          task.title.toLowerCase().includes(q) ||
          task.description.toLowerCase().includes(q);

        return matchesStatus && matchesPriority && matchesSearch;
      });
    }

    function addTask(title, description = '', priority = 'medium') {
      const now = new Date();
      const createdTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newTask = {
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: title.trim(),
        description: description.trim(),
        completed: false,
        priority: priority,
        createdAt: createdTime
      };

      tasks.unshift(newTask);
      StorageModule.saveTasks(tasks);
      return newTask;
    }

    /**
     * Chuyển đổi trạng thái hoàn thành của task
     * @param {string} taskId
     * @returns {boolean} Trạng thái mới: true nếu vừa hoàn thành, false nếu chuyển về chưa xong
     */
    function toggleTaskStatus(taskId) {
      const index = tasks.findIndex((t) => t.id === taskId);
      if (index !== -1) {
        tasks[index].completed = !tasks[index].completed;
        const isNowCompleted = tasks[index].completed;
        StorageModule.saveTasks(tasks);
        return isNowCompleted;
      }
      return false;
    }

    function deleteTask(taskId) {
      tasks = tasks.filter((t) => t.id !== taskId);
      StorageModule.saveTasks(tasks);
    }

    function clearCompletedTasks() {
      tasks = tasks.filter((t) => !t.completed);
      StorageModule.saveTasks(tasks);
    }

    function getStatistics() {
      const total = tasks.length;
      const completed = tasks.filter((t) => t.completed).length;
      const active = total - completed;
      const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

      return { total, completed, active, percentage };
    }

    function setStatusFilter(filter) {
      statusFilter = filter;
    }

    function getStatusFilter() {
      return statusFilter;
    }

    function setPriorityFilter(priority) {
      priorityFilter = priority;
    }

    function setSearchQuery(query) {
      searchQuery = query.trim();
    }

    function getSearchQuery() {
      return searchQuery;
    }

    return {
      init,
      getAllTasks,
      getFilteredTasks,
      addTask,
      toggleTaskStatus,
      deleteTask,
      clearCompletedTasks,
      getStatistics,
      setStatusFilter,
      getStatusFilter,
      setPriorityFilter,
      setSearchQuery,
      getSearchQuery
    };
  })();

  // ==================================================================
  // 5. RENDER MODULE: ĐỒNG BỘ GIAO DIỆN (UI RENDERER & ACCORDION)
  // ==================================================================
  const RenderModule = (() => {
    const taskListEl = document.getElementById('task-list');
    const emptyStateEl = document.getElementById('empty-state');
    const emptyTitleEl = document.getElementById('empty-title');
    const emptyDescEl = document.getElementById('empty-desc');

    const totalTasksCountEl = document.getElementById('total-tasks-count');
    const completedStatsTextEl = document.getElementById('completed-stats-text');
    const progressBarFillEl = document.getElementById('progress-bar-fill');

    // Sidebar Badges
    const badgeAll = document.getElementById('badge-all');
    const badgeActive = document.getElementById('badge-active');
    const badgeCompleted = document.getElementById('badge-completed');

    // Search Status Bar
    const searchStatusBar = document.getElementById('search-status-bar');
    const searchQueryText = document.getElementById('search-query-text');

    function escapeHTML(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function getPriorityInfo(priority) {
      switch (priority) {
        case 'high':
          return { label: 'Quan trọng', className: 'high', borderClass: 'priority-high' };
        case 'low':
          return { label: 'Thấp', className: 'low', borderClass: 'priority-low' };
        case 'medium':
        default:
          return { label: 'Bình thường', className: 'medium', borderClass: 'priority-medium' };
      }
    }

    function createTaskItemHTML(task) {
      const priorityInfo = getPriorityInfo(task.priority);
      const isCompleted = task.completed;
      const hasDescription = Boolean(task.description && task.description.trim() !== '');

      return `
        <li class="task-item ${priorityInfo.borderClass} ${isCompleted ? 'completed' : ''}" data-task-id="${task.id}">
          <div class="task-left">
            <div class="custom-checkbox" aria-label="Đánh dấu hoàn thành">
              <i class="fa-solid fa-check"></i>
            </div>
            <div class="task-content">
              <div class="task-header-row">
                <span class="task-text">${escapeHTML(task.title)}</span>
                ${
                  hasDescription
                    ? `<button class="btn-toggle-desc" type="button" title="Mở rộng / Thu gọn mô tả" aria-label="Xem mô tả chi tiết">
                         <i class="fa-solid fa-chevron-down"></i>
                       </button>`
                    : ''
                }
              </div>

              ${
                hasDescription
                  ? `<div class="task-desc-container">
                       <p class="task-desc-text">${escapeHTML(task.description)}</p>
                     </div>`
                  : ''
              }

              <div class="task-meta">
                <span class="badge-priority ${priorityInfo.className}">${priorityInfo.label}</span>
                <span class="task-time"><i class="fa-regular fa-clock"></i> ${task.createdAt}</span>
                ${
                  hasDescription
                    ? `<span class="has-desc-indicator"><i class="fa-regular fa-comment-dots"></i> Có ghi chú</span>`
                    : ''
                }
              </div>
            </div>
          </div>
          <div class="task-actions">
            <button class="btn-delete" type="button" title="Xóa công việc">
              <i class="fa-solid fa-trash-can"></i> Xóa
            </button>
          </div>
        </li>
      `;
    }

    function renderTasks() {
      if (!taskListEl) return;

      const filteredTasks = TaskStore.getFilteredTasks();
      const currentQuery = TaskStore.getSearchQuery();

      if (searchStatusBar && searchQueryText) {
        if (currentQuery) {
          searchStatusBar.style.display = 'flex';
          searchQueryText.textContent = `"${currentQuery}" (${filteredTasks.length} kết quả)`;
        } else {
          searchStatusBar.style.display = 'none';
        }
      }

      if (filteredTasks.length === 0) {
        taskListEl.innerHTML = '';
        if (emptyStateEl) {
          emptyStateEl.classList.add('visible');
          if (currentQuery) {
            emptyTitleEl.textContent = 'Không tìm thấy kết quả!';
            emptyDescEl.textContent = `Không có công việc nào khớp với từ khóa "${currentQuery}".`;
          } else {
            emptyTitleEl.textContent = 'Không có công việc nào!';
            emptyDescEl.textContent = 'Hãy thêm công việc mới hoặc thử thay đổi bộ lọc trạng thái.';
          }
        }
      } else {
        if (emptyStateEl) emptyStateEl.classList.remove('visible');
        taskListEl.innerHTML = filteredTasks.map(createTaskItemHTML).join('');
      }

      renderSidebarBadgesAndFooter();
    }

    function renderSidebarBadgesAndFooter() {
      const stats = TaskStore.getStatistics();

      if (totalTasksCountEl) totalTasksCountEl.textContent = stats.total;
      if (completedStatsTextEl) {
        completedStatsTextEl.textContent = `Đã hoàn thành: ${stats.completed} / ${stats.total} (${stats.percentage}%)`;
      }
      if (progressBarFillEl) {
        progressBarFillEl.style.width = `${stats.percentage}%`;
      }

      if (badgeAll) badgeAll.textContent = stats.total;
      if (badgeActive) badgeActive.textContent = stats.active;
      if (badgeCompleted) badgeCompleted.textContent = stats.completed;
    }

    return {
      renderTasks,
      renderSidebarBadgesAndFooter
    };
  })();

  // ==================================================================
  // 6. CLOCK MODULE: ĐỒNG HỒ THỜI GIAN THỰC HEADER (1000MS)
  // ==================================================================
  const ClockModule = (() => {
    const realtimeClockEl = document.getElementById('realtime-clock');
    const realtimeDateEl = document.getElementById('realtime-date');
    const dayPeriodTextEl = document.getElementById('day-period-text');

    function update() {
      if (!realtimeClockEl) return;

      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      realtimeClockEl.textContent = `${hours}:${minutes}:${seconds}`;

      if (dayPeriodTextEl) {
        const hour = now.getHours();
        if (hour >= 5 && hour < 12) {
          dayPeriodTextEl.textContent = 'Buổi sáng năng lượng';
        } else if (hour >= 12 && hour < 18) {
          dayPeriodTextEl.textContent = 'Buổi chiều hiệu quả';
        } else {
          dayPeriodTextEl.textContent = 'Buổi tối thư giãn';
        }
      }

      if (realtimeDateEl) {
        const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        const dayName = days[now.getDay()];
        const dateStr = String(now.getDate()).padStart(2, '0');
        const monthStr = String(now.getMonth() + 1).padStart(2, '0');
        const yearStr = now.getFullYear();
        realtimeDateEl.textContent = `${dayName}, ${dateStr}/${monthStr}/${yearStr}`;
      }
    }

    function start() {
      update();
      setInterval(update, 1000);
    }

    return { start };
  })();

  // ==================================================================
  // 7. APP CONTROLLER: ĐIỀU PHỐI SỰ KIỆN DOM & EVENT DELEGATION
  // ==================================================================
  const AppController = (() => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoDesc = document.getElementById('todo-desc');
    const prioritySelect = document.getElementById('priority-select');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');

    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search-btn');
    const resetSearchLink = document.getElementById('reset-search-link');

    const navFilterBtns = document.querySelectorAll('.nav-filter-btn');
    const priorityPills = document.querySelectorAll('.priority-pill');
    const clearCompletedBtn = document.getElementById('clear-completed-btn');

    const userNameEl = document.getElementById('user-name');

    function handleAddTask() {
      if (!todoInput) return;

      const rawTitle = todoInput.value;
      const trimmedTitle = rawTitle.trim();
      const rawDesc = todoDesc ? todoDesc.value : '';
      const trimmedDesc = rawDesc.trim();

      if (trimmedTitle === '') {
        alert('Vui lòng nhập nội dung!');
        todoInput.focus();
        return;
      }

      const selectedPriority = prioritySelect ? prioritySelect.value : 'medium';

      TaskStore.addTask(trimmedTitle, trimmedDesc, selectedPriority);
      RenderModule.renderTasks();

      todoInput.value = '';
      if (todoDesc) {
        todoDesc.value = '';
      }
      todoInput.focus();
    }

    /**
     * Kỹ thuật Event Delegation trên <ul> (#task-list):
     * Tích hợp xử lý Xóa, Accordion và Bắn pháo hoa Confetti khi hoàn thành task
     */
    function setupEventDelegation() {
      if (!taskList) return;

      taskList.addEventListener('click', (e) => {
        const target = e.target;

        // 1. CLICK NÚT "XÓA"
        const deleteBtn = target.closest('.btn-delete');
        if (deleteBtn) {
          e.stopPropagation();
          const taskItem = deleteBtn.closest('.task-item');
          if (!taskItem || taskItem.classList.contains('deleting')) return;

          const taskId = taskItem.dataset.taskId;
          taskItem.classList.add('deleting');

          setTimeout(() => {
            TaskStore.deleteTask(taskId);
            RenderModule.renderTasks();
          }, 350);
          return;
        }

        // 2. CLICK NÚT ACCORDION CHEVRON
        const toggleDescBtn = target.closest('.btn-toggle-desc');
        if (toggleDescBtn) {
          e.stopPropagation();
          const taskItem = toggleDescBtn.closest('.task-item');
          if (taskItem) {
            taskItem.classList.toggle('expanded');
          }
          return;
        }

        // 3. CLICK VÀO VÙNG CHECKBOX HOẶC DÒNG CHỮ ĐỂ HOÀN THÀNH
        const isDescTextClick = target.closest('.task-desc-text');
        if (isDescTextClick) {
          return; // Bỏ qua nếu click chọn chữ bên trong vùng mô tả
        }

        const taskLeft = target.closest('.task-left');
        if (taskLeft) {
          const taskItem = taskLeft.closest('.task-item');
          if (!taskItem || taskItem.classList.contains('deleting')) return;

          const taskId = taskItem.dataset.taskId;

          // Chuyển đổi trạng thái và kiểm tra xem có vừa hoàn thành hay không
          const isNowCompleted = TaskStore.toggleTaskStatus(taskId);

          // 👉 KÍCH HOẠT PHÁO HOA CONFETTI: Chỉ bắn khi vừa hoàn thành (chưa hoàn thành -> hoàn thành)
          if (isNowCompleted) {
            ConfettiModule.fireAt(e.clientX, e.clientY);

            // Nếu vừa hoàn thành 100% tất cả các task hiện có: Bắn pháo hoa đại tiệc!
            const stats = TaskStore.getStatistics();
            if (stats.total > 0 && stats.completed === stats.total) {
              setTimeout(() => {
                ConfettiModule.fireCelebration();
              }, 320);
            }
          }

          // Cập nhật lại giao diện
          RenderModule.renderTasks();
        }
      });
    }

    function registerEvents() {
      if (todoForm) {
        todoForm.addEventListener('submit', (e) => {
          e.preventDefault();
          handleAddTask();
        });
      }

      if (todoInput) {
        todoInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTask();
          }
        });
      }

      if (todoDesc) {
        todoDesc.addEventListener('keydown', (e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleAddTask();
          }
        });
      }

      if (addBtn) {
        addBtn.addEventListener('click', (e) => {
          e.preventDefault();
          handleAddTask();
        });
      }

      // Real-time Search
      if (searchInput) {
        searchInput.addEventListener('input', () => {
          const query = searchInput.value;
          TaskStore.setSearchQuery(query);

          if (clearSearchBtn) {
            clearSearchBtn.style.display = query ? 'block' : 'none';
          }

          RenderModule.renderTasks();
        });
      }

      if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
          if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
          }
          TaskStore.setSearchQuery('');
          clearSearchBtn.style.display = 'none';
          RenderModule.renderTasks();
        });
      }

      if (resetSearchLink) {
        resetSearchLink.addEventListener('click', () => {
          if (searchInput) {
            searchInput.value = '';
          }
          TaskStore.setSearchQuery('');
          if (clearSearchBtn) clearSearchBtn.style.display = 'none';
          RenderModule.renderTasks();
        });
      }

      // Bộ lọc theo Trạng thái
      navFilterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          navFilterBtns.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');

          const filter = btn.dataset.filter || 'all';
          TaskStore.setStatusFilter(filter);
          RenderModule.renderTasks();
        });
      });

      // Bộ lọc theo Độ ưu tiên
      priorityPills.forEach((pill) => {
        pill.addEventListener('click', () => {
          priorityPills.forEach((p) => p.classList.remove('active'));
          pill.classList.add('active');

          const priority = pill.dataset.priorityFilter || 'all';
          TaskStore.setPriorityFilter(priority);
          RenderModule.renderTasks();
        });
      });

      // Dọn dẹp việc đã xong
      if (clearCompletedBtn) {
        clearCompletedBtn.addEventListener('click', () => {
          const completedTasks = TaskStore.getAllTasks().filter((t) => t.completed);
          if (completedTasks.length === 0) return;

          const completedDOMElements = taskList.querySelectorAll('.task-item.completed');
          completedDOMElements.forEach((el) => el.classList.add('deleting'));

          setTimeout(() => {
            TaskStore.clearCompletedTasks();
            RenderModule.renderTasks();
          }, 350);
        });
      }

      // Tên người dùng cá nhân hóa
      if (userNameEl) {
        userNameEl.textContent = StorageModule.loadUserName();

        userNameEl.addEventListener('blur', () => {
          const sanitized = userNameEl.textContent.trim() || 'Khoa';
          userNameEl.textContent = sanitized;
          StorageModule.saveUserName(sanitized);
        });

        userNameEl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            userNameEl.blur();
          }
        });
      }

      setupEventDelegation();
    }

    return { registerEvents };
  })();

  // ==================================================================
  // 8. KHỞI TẠO ỨNG DỤNG TOÀN DIỆN (APP BOOTSTRAP)
  // ==================================================================
  function bootstrap() {
    ThemeModule.init();
    TaskStore.init();
    ClockModule.start();
    AppController.registerEvents();
    RenderModule.renderTasks();
  }

  bootstrap();
});
