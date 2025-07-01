import { getCollection } from 'astro:content';

// Test script to verify project gallery integration
async function testProjectGallery() {
  try {
    const projects = await getCollection('projects');
    console.log('✅ Successfully loaded projects:', projects.length);
    
    // Check projects with galleries
    const projectsWithGalleries = projects.filter(project => 
      project.data.gallery && project.data.gallery.length > 0
    );
    
    console.log('📸 Projects with galleries:', projectsWithGalleries.length);
    
    projectsWithGalleries.forEach(project => {
      console.log(`  - ${project.data.title}: ${project.data.gallery.length} images`);
      
      // Validate gallery structure
      project.data.gallery.forEach((image, index) => {
        if (!image.src || !image.alt) {
          console.warn(`    ⚠️ Image ${index + 1} missing required fields`);
        }
      });
    });
    
    console.log('✅ Gallery integration test completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error testing project gallery:', error);
    return false;
  }
}

testProjectGallery();
