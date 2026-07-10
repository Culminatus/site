// Mega Yapı - Admin Panel Mantığı

// Fotoğraf compress et ve base64 convert et
function compressImage(file, callback) {
  const reader = new FileReader();
  
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Max 1200px
      if (width > height) {
        if (width > 1200) {
          height = Math.round((height * 1200) / width);
          width = 1200;
        }
      } else {
        if (height > 1200) {
          width = Math.round((width * 1200) / height);
          height = 1200;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(function(blob) {
        const compressedReader = new FileReader();
        compressedReader.onload = function(e) {
          callback(e.target.result);
        };
        compressedReader.readAsDataURL(blob);
      }, 'image/jpeg', 0.8);
    };
    img.src = e.target.result;
  };
  
  reader.readAsDataURL(file);
}
function compressImagePromise(file) {
  return new Promise((resolve) => {
    compressImage(file, (base64) => {
      resolve(base64);
    });
  });
}
// Admin panel DOM render et
function renderAdminPanel() {
  const projects = getProjects();
  const projectsList = document.getElementById('projectsList');
  
  if (!projectsList) return;
  
  projectsList.innerHTML = projects.map(project => `
    <tr>
      <td>${project.name}</td>
      <td>${project.year}</td>
      <td>${project.unitCount}</td>
      <td class="actions">
        <button class="btn-edit" onclick="editProject(${project.id})">Düzenle</button>
        <button class="btn-delete" onclick="deleteProjectFromAdmin(${project.id})">Sil</button>
      </td>
    </tr>
  `).join('');
  
  document.getElementById('projectCount').textContent = projects.length;
}

// Proje form temizle
function resetProjectForm() {
  document.getElementById('projectForm').reset();
  document.getElementById('formTitle').textContent = 'Yeni Proje Ekle';
  document.getElementById('submitBtn').textContent = 'Proje Ekle';
  document.getElementById('cancelBtn').style.display = 'none';
  document.getElementById('currentProjectId').value = '';
  document.getElementById('imagePreview').innerHTML = '';
  document.getElementById('galleryPreview').innerHTML = ''; // Yeni satır
}

async function processGallery(files) {
  if (!files || files.length === 0) return [];
  const gallery = [];
  for (let file of files) {
    const base64 = await compressImagePromise(file);
    gallery.push(base64);
  }
  return gallery;
}

// Proje ekle/güncelle
document.addEventListener('DOMContentLoaded', () => {
  const projectForm = document.getElementById('projectForm');
  
  if (!projectForm) return;
  
  projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Form verilerini al
    const currentId = document.getElementById('currentProjectId').value;
    const name = document.getElementById('projectName').value;
    const year = document.getElementById('projectYear').value;
    const unitCount = document.getElementById('projectUnitCount').value;
    const address = document.getElementById('projectAddress').value;
    const description = document.getElementById('projectDescription').value;
    
    // Fotoğrafları al
    const imageFile = document.getElementById('projectImage').files[0];
    const galleryFiles = document.getElementById('projectGallery').files;

    if (!name || !year || !unitCount || !address) {
      alert('Lütfen tüm alanları doldurunuz!');
      return;
    }

    // Mevcut projeyi al (güncelleme ise)
    let existingProject = currentId ? getProjectById(parseInt(currentId)) : null;

    // Fotoğrafları işle
    let coverImage = imageFile ? await compressImagePromise(imageFile) : (existingProject ? existingProject.image : null);
    let gallery = galleryFiles.length > 0 ? await processGallery(galleryFiles) : (existingProject ? existingProject.gallery : []);

    if (!coverImage && !currentId) {
      alert('Lütfen bir kapak fotoğrafı seçiniz!');
      return;
    }

    const projectData = {
      name,
      year: parseInt(year),
      unitCount: parseInt(unitCount),
      address,
      description,
      image: coverImage,
      gallery: gallery // Galeri buraya eklendi
    };

    if (currentId) {
      updateProject(parseInt(currentId), projectData);
      alert('Proje güncellendi!');
    } else {
      addProject(projectData);
      alert('Proje eklendi!');
    }
    
    renderAdminPanel();
    resetProjectForm();
  });
});

// Proje düzenle
function editProject(id) {
  const project = getProjectById(id);
  if (!project) return;
  
  document.getElementById('projectName').value = project.name;
  document.getElementById('projectYear').value = project.year;
  document.getElementById('projectUnitCount').value = project.unitCount;
  document.getElementById('projectAddress').value = project.address;
  document.getElementById('projectDescription').value = project.description || '';
  document.getElementById('currentProjectId').value = id;
  document.getElementById('formTitle').textContent = 'Proje Düzenle: ' + project.name;
  document.getElementById('submitBtn').textContent = 'Güncelle';
  document.getElementById('cancelBtn').style.display = 'inline-block';
  
  if (project.image) {
    document.getElementById('imagePreview').innerHTML = `
      <img src="${project.image}" alt="Mevcut fotoğraf" style="max-width: 200px; max-height: 200px; border-radius: 8px;">
      <p style="font-size: 12px; color: #999; margin-top: 8px;">Değiştirmek için yeni bir fotoğraf seçin</p>
    `;
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Admin panelinden proje sil
function deleteProjectFromAdmin(id) {
  if (confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
    deleteProject(id);
    renderAdminPanel();
    alert('Proje silindi!');
  }
}

// İptal butonu
document.addEventListener('DOMContentLoaded', () => {
  const cancelBtn = document.getElementById('cancelBtn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', resetProjectForm);
  }
});
