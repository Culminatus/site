// Mega Yapı - Ana Uygulama Mantığı

// Mega Yapı - Ana Uygulama Mantığı (JSON Fetch Versiyonu)

// JSON dosyasından projeleri asenkron olarak çek
async function getProjects() {
  try {
    const response = await fetch('assets/data/projects.json');
    if (!response.ok) {
      throw new Error('Projeler yüklenemedi');
    }
    const projects = await response.json();
    return projects;
  } catch (error) {
    console.error('Hata:', error);
    return []; // Hata durumunda boş liste dön
  }
}

// ID ile proje al (Artık asenkron çalışıyor)
async function getProjectById(id) {
  const projects = await getProjects();
  return projects.find(p => p.id === parseInt(id) || p.id === id);
}
// LocalStorage'dan projeleri al
/*function getProjects() {
  const projects = localStorage.getItem('megayapi_projects');
  return projects ? JSON.parse(projects) : [];
}

// Projeleri kaydet
function saveProjects(projects) {
  localStorage.setItem('megayapi_projects', JSON.stringify(projects));
}

// Yeni proje ekle
function addProject(project) {
  const projects = getProjects();
  project.id = Date.now();
  project.createdAt = new Date().toISOString();
  projects.push(project);
  saveProjects(projects);
  return project;
}*/

// Proje güncelle
function updateProject(id, updatedProject) {
  let projects = getProjects();
  projects = projects.map(p => p.id === id ? { ...p, ...updatedProject } : p);
  saveProjects(projects);
}

// Proje sil
function deleteProject(id) {
  let projects = getProjects();
  projects = projects.filter(p => p.id !== id);
  saveProjects(projects);
}
/*
// ID ile proje al
function getProjectById(id) {
  const projects = getProjects();
  return projects.find(p => p.id === parseInt(id));
}*/

// Header scroll efekti
function initializeHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, 10);
  });
}

// Mobile menu
function initializeMobileMenu() {
  const burger = document.getElementById('burgerBtn');
  const nav = document.querySelector('nav');
  
  if (!burger || !nav) return;
  
  burger.addEventListener('click', () => {
    const isOpen = nav.classList.contains('menu-open');
    if (isOpen) {
      nav.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', 'false');
    } else {
      nav.classList.add('menu-open');
      burger.setAttribute('aria-expanded', 'true');
    }
  });
  
  // Close menu on link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
  
  // Close menu on resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      nav.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
}

// Sayfa yüklenmesi tamamlandığında
document.addEventListener('DOMContentLoaded', () => {
  initializeHeader();
  initializeMobileMenu();
});
