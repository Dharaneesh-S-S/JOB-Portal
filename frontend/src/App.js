import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import RoleRoute from './components/common/RoleRoute';

// Layout Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Alert from './components/common/Alert';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CompanyDashboard from './pages/company/Dashboard';
import FreelancerDashboard from './pages/freelancer/Dashboard';
import JobSeekerDashboard from './pages/jobseeker/Dashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <Alert />
          <main className="flex-grow">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              
              <PrivateRoute path="/company">
                <RoleRoute role="company">
                  <Route path="/company/dashboard" component={CompanyDashboard} />
                </RoleRoute>
              </PrivateRoute>
              
              <PrivateRoute path="/freelancer">
                <RoleRoute role="freelancer">
                  <Route path="/freelancer/dashboard" component={FreelancerDashboard} />
                </RoleRoute>
              </PrivateRoute>
              
              <PrivateRoute path="/jobseeker">
                <RoleRoute role="jobseeker">
                  <Route path="/jobseeker/dashboard" component={JobSeekerDashboard} />
                </RoleRoute>
              </PrivateRoute>
              
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;