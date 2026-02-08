import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projects } from '../data/projects';
import './ProjectDetail.css';

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams();
  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    return (
      <section className="project-detail">
        <div className="project-detail-container">
          <h1>Project not found</h1>
          <p>That project page doesn’t exist yet.</p>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="project-detail">
      <div className="project-detail-container">
        <Link to="/" className="project-detail-back">
          ← Back to Home
        </Link>

        <motion.div
          className="project-detail-hero"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="project-detail-image">
            <img src={project.image} alt={`${project.title} project preview`} />
          </div>
          <div className="project-detail-summary">
            <h1>{project.title}</h1>
            <p>{project.summary}</p>
            <div className="project-detail-tags">
              {project.technologies.map((tech) => (
                <span key={tech} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>
            <div className="project-detail-links">
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                View Code
              </a>
              {project.liveUrl ? (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  Live Demo
                </a>
              ) : (
                <span className="project-detail-demo">Demo: Not available</span>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="project-detail-body"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div>
            <h2>Overview</h2>
            <p>{project.longDescription}</p>
          </div>

          <div>
            <h2>Highlights</h2>
            <ul>
              {project.impact.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectDetail;
