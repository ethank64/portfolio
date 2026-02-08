import { motion } from 'framer-motion';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../data/projects';

interface ProjectCardProps {
  project: Project;
  index: number;
  featured?: boolean;
  onOpenDetails: (project: Project) => void;
}

const ProjectCard: FC<ProjectCardProps> = ({ project, index, featured = false, onOpenDetails }) => {
  return (
    <motion.article
      className={`project-card ${featured ? 'featured' : ''}`.trim()}
      initial={{ opacity: 0, y: featured ? 50 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: featured ? 0.8 : 0.6, delay: index * (featured ? 0.2 : 0.1) }}
      viewport={{ once: true }}
      whileHover={{ y: featured ? -10 : -5 }}
    >
      <div className="project-image">
        <img src={project.image} alt={`${project.title} project preview`} loading="lazy" />
        <div className="project-overlay">
          <div className="project-links">
            <Link to={`/projects/${project.id}`} className="project-link">
              <span>Details</span>
            </Link>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
              <span>GitHub</span>
            </a>
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.summary}</p>

        <div className="project-technologies" aria-label={`${project.title} technologies`}>
          {project.technologies.map((tech) => (
            <span key={tech} className="tech-tag">
              {tech}
            </span>
          ))}
        </div>

        <motion.button
          className="project-details-btn"
          onClick={() => onOpenDetails(project)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View Details
        </motion.button>
      </div>
    </motion.article>
  );
};

export default ProjectCard;
