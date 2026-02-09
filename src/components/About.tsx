import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const About: React.FC = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <motion.div
          className="about-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="about-text">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              About Me
            </motion.h2>
            
            <motion.p
              className="about-description"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              I'm a passionate software engineer with a love for creating innovative solutions 
              and exceptional user experiences. With expertise in full-stack development, I enjoy 
              tackling complex problems and turning ideas into reality through clean, efficient code.
            </motion.p>
            
            <motion.p
              className="about-description"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              When I'm not coding, you can find me exploring new technologies, contributing to 
              open-source projects, or sharing knowledge with the developer community. I believe 
              in continuous learning and staying up-to-date with the latest industry trends.
            </motion.p>
          </div>
          
          <motion.div
            className="skills-section"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="skills-title">Technical Skills</h3>

            <div className="skills-groups">
              <div className="skills-group">
                <h4 className="skills-group-title">Languages &amp; Core</h4>
                <div className="skills-icons">
                  <img src="https://skillicons.dev/icons?i=python" alt="Python" />
                  <img src="https://skillicons.dev/icons?i=cpp" alt="C++" />
                  <img src="https://skillicons.dev/icons?i=cs" alt="C#" />
                  <img src="https://skillicons.dev/icons?i=ts" alt="TypeScript" />
                  <img src="https://skillicons.dev/icons?i=js" alt="JavaScript" />
                  <img src="https://skillicons.dev/icons?i=html" alt="HTML" />
                  <img src="https://skillicons.dev/icons?i=css" alt="CSS" />
                  <img src="https://skillicons.dev/icons?i=scss" alt="SCSS" />
                </div>
              </div>

              <div className="skills-group">
                <h4 className="skills-group-title">Frameworks &amp; Libraries</h4>
                <div className="skills-icons">
                  <img src="https://skillicons.dev/icons?i=react" alt="React" />
                  <img src="https://skillicons.dev/icons?i=nextjs" alt="Next.js" />
                  <img src="https://skillicons.dev/icons?i=angular" alt="Angular" />
                  <img src="https://skillicons.dev/icons?i=fastapi" alt="FastAPI" />
                  <img src="https://skillicons.dev/icons?i=tailwind" alt="TailwindCSS" />
                  <img src="https://skillicons.dev/icons?i=tensorflow" alt="TensorFlow" />
                  <img src="https://skillicons.dev/icons?i=p5js" alt="p5.js" />
                </div>
              </div>

              <div className="skills-group">
                <h4 className="skills-group-title">Platforms &amp; Tools</h4>
                <div className="skills-icons">
                  <img src="https://skillicons.dev/icons?i=aws" alt="AWS" />
                  <img src="https://skillicons.dev/icons?i=terraform" alt="Terraform" />
                  <img src="https://skillicons.dev/icons?i=docker" alt="Docker" />
                  <img src="https://skillicons.dev/icons?i=unity" alt="Unity" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
