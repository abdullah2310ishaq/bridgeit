import React from 'react';

const ProjectPage = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>Bridgeart</h1>
          <nav>
            <a href="#" style={{ marginRight: '10px' }}>Home</a>
            <a href="#">Student Profile</a>
          </nav>
        </div>
        <button>Logout</button>
      </header>

      <main>
        <h2>Project: Smart Traffic Management System</h2>
        <p>
          Creating a smart city solution that uses IoT sensors and real-time data to optimize traffic flow and reduce congestion.
        </p>

        <section>
          <h3>Technologies Used:</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ backgroundColor: '#e0e0e0', padding: '5px 10px', borderRadius: '5px' }}>IoT Sensors-Raspberry Pi</span>
            <span style={{ backgroundColor: '#e0e0e0', padding: '5px 10px', borderRadius: '5px' }}>Real-time Data Processing</span>
            <span style={{ backgroundColor: '#e0e0e0', padding: '5px 10px', borderRadius: '5px' }}>Cloud Platforms-AWS IoT</span>
            <span style={{ backgroundColor: '#e0e0e0', padding: '5px 10px', borderRadius: '5px' }}>Backend-Node.js</span>
            <span style={{ backgroundColor: '#e0e0e0', padding: '5px 10px', borderRadius: '5px' }}>Database-MongoDB</span>
            <span style={{ backgroundColor: '#e0e0e0', padding: '5px 10px', borderRadius: '5px' }}>Machine Learning-TensorFlow</span>
          </div>
        </section>

        <section style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <div style={{ flex: 1 }}>
            <h3>Project Progress</h3>
            <div style={{ backgroundColor: '#f0f0f0', borderRadius: '5px', padding: '10px', width: '80%' }}>
              <div style={{ backgroundColor: '#007bff', height: '10px', borderRadius: '5px', width: '76%' }}></div>
              <p>76% completed</p>
              <p>Duration: March 2024–September 2024</p>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3>Project Supervisor</h3>
            <div style={{ backgroundColor: '#e0e0e0', borderRadius: '50%', width: '100px', height: '100px', margin: '0 auto' }}></div>
            <p>Ms. Warda Aslam</p>
          </div>
        </section>

        <section style={{ marginTop: '30px' }}>
          <h3>Meet The Team</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ backgroundColor: '#e0e0e0', borderRadius: '50%', width: '100px', height: '100px', margin: '0 auto' }}></div>
              <p>Faizan Asghar</p>
              <p>Backend Developer</p>
              <button>View Profile</button>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ backgroundColor: '#e0e0e0', borderRadius: '50%', width: '100px', height: '100px', margin: '0 auto' }}></div>
              <p>Abdullah Ishaq</p>
              <p>IoT Specialist</p>
              <button>View Profile</button>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ backgroundColor: '#e0e0e0', borderRadius: '50%', width: '100px', height: '100px', margin: '0 auto' }}></div>
              <p>John David</p>
              <p>Data Scientist</p>
              <button>View Profile</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProjectPage;
