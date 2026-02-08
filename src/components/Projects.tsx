import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Projects.css';
import { projects, type Project } from '../data/projects';
import ProjectCard from './ProjectCard';

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const featuredProjects = useMemo(() => projects.filter((project) => project.featured), []);

  return (
    <section id="projects" className="projects" aria-labelledby="projects-title">
      <div className="container">
        <motion.h2
          id="projects-title"
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Featured Projects
        </motion.h2>

        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Real projects with shipped code: hardware, mobile, and practical software execution.
        </motion.p>

        <div className="projects-grid">
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              featured
              onOpenDetails={setSelectedProject}
            />
          ))}
        </div>

        <div className="currently-building">
          <h3>Currently Building</h3>
          <p>
            Expanding the portfolio with deeper case studies, cleaner project architecture, and polished demos.
            More builds coming soon.
          </p>
        </div>
      </div>

      {selectedProject && (
        <motion.div
          className="project-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setSelectedProject(null)} aria-label="Close project details">
              ×
            </button>

            <div className="modal-image">
              <img src={selectedProject.image} alt={`${selectedProject.title} project preview`} loading="lazy" />
            </div>

            <div className="modal-body">
              <h3 className="modal-title">{selectedProject.title}</h3>
              <p className="modal-description">{selectedProject.longDescription}</p>

              <div className="modal-technologies">
                <h4>Technologies Used:</h4>
                <div className="tech-tags">
                  {selectedProject.technologies.map((tech) => (
                    <span key={tech} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="modal-impact">
                <h4>Highlights:</h4>
                <ul>
                  {selectedProject.impact.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="modal-links">
                <Link to={`/projects/${selectedProject.id}`} className="btn btn-primary">
                  Project Page
                </Link>
                <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  View Code
                </a>
                {selectedProject.liveUrl && (
                  <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Projects;
