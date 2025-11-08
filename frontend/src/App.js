import React, { useState } from 'react';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CircularProgress from '@mui/material/CircularProgress';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0ea5e9',
      light: '#38bdf8',
      dark: '#0284c7',
    },
    secondary: {
      main: '#14b8a6',
      light: '#2dd4bf',
      dark: '#0d9488',
    },
    success: {
      main: '#22c55e',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  ],
});

function App() {
  const [topic, setTopic] = useState('');
  const [lessonPlan, setLessonPlan] = useState('');
  const [quiz, setQuiz] = useState([]);
  const [assignment, setAssignment] = useState('');
  const [summary, setSummary] = useState('');
  const [lmsStatus, setLmsStatus] = useState('');
  const [qaContext, setQaContext] = useState('');
  const [qaQuestion, setQaQuestion] = useState('');
  const [qaAnswer, setQaAnswer] = useState('');
  const [loading, setLoading] = useState({
    lessonPlan: false,
    quiz: false,
    assignment: false,
    summary: false,
    lms: false,
    qa: false,
  });


  const generateLessonPlan = async () => {
    setLoading({ ...loading, lessonPlan: true });
    try {
      const response = await axios.get(`http://localhost:8000/lesson-plan?topic=${topic}`);
      setLessonPlan(response.data.lesson_plan);
    } catch (error) {
      console.error('Error generating lesson plan:', error);
    } finally {
      setLoading({ ...loading, lessonPlan: false });
    }
  };

  const generateQuiz = async () => {
    setLoading({ ...loading, quiz: true });
    try {
      const response = await axios.get(`http://localhost:8000/quiz?topic=${topic}`);
      setQuiz(response.data.quiz);
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setLoading({ ...loading, quiz: false });
    }
  };

  const generateAssignment = async () => {
    setLoading({ ...loading, assignment: true });
    try {
      const response = await axios.get(`http://localhost:8000/assignment?topic=${topic}`);
      setAssignment(response.data.assignment);
    } catch (error) {
      console.error('Error generating assignment:', error);
    } finally {
      setLoading({ ...loading, assignment: false });
    }
  };

  const summarizeUnderstanding = async () => {
    setLoading({ ...loading, summary: true });
    try {
      const response = await axios.post('http://localhost:8000/summarize', { topic });
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error summarizing:', error);
    } finally {
      setLoading({ ...loading, summary: false });
    }
  };

  const integrateLMS = async () => {
    setLoading({ ...loading, lms: true });
    try {
      const response = await axios.post('http://localhost:8000/integrate-lms', { topic });
      setLmsStatus(response.data.status);
    } catch (error) {
      console.error('Error integrating LMS:', error);
    } finally {
      setLoading({ ...loading, lms: false });
    }
  };

  const answerQuestion = async () => {
    setLoading({ ...loading, qa: true });
    try {
      const response = await axios.post('http://localhost:8000/question-answering', {
        context: qaContext,
        question: qaQuestion,
      });
      setQaAnswer(response.data.answer);
    } catch (error) {
      console.error('Error answering question:', error);
    } finally {
      setLoading({ ...loading, qa: false });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
        {/* Header */}
        <Box 
          sx={{ 
            background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
            py: { xs: 4, md: 8 },
            mb: 4,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
              opacity: 0.4,
            }
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <Typography 
                variant="h3" 
                component="h1"
                sx={{ 
                  color: 'white',
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: '2rem', md: '3rem' },
                  textShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                🎓 Educator Copilot
              </Typography>
              <Typography 
                variant="h6"
                sx={{ 
                  color: 'rgba(255,255,255,0.95)',
                  fontWeight: 400,
                  maxWidth: '600px',
                  mx: 'auto',
                  fontSize: { xs: '1rem', md: '1.25rem' }
                }}
              >
                Transform your teaching with AI-powered lesson planning, quizzes, and interactive content
              </Typography>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="xl" sx={{ pb: 6 }}>
          {/* Topic Input Section */}
          <Card 
            elevation={0} 
            sx={{ 
              mb: 4, 
              border: '2px solid',
              borderColor: 'primary.light',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: '0 8px 24px rgba(14, 165, 233, 0.15)',
              }
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span style={{ fontSize: '1.75rem' }}>📚</span>
                  What would you like to teach today?
                </Typography>
              </Box>
              <TextField
                fullWidth
                label="Enter your topic"
                variant="outlined"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Photosynthesis, World War II, Python Programming..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    fontSize: '1.1rem',
                    '& fieldset': {
                      borderWidth: 2,
                      borderColor: 'divider',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '1.1rem',
                    fontWeight: 500,
                  },
                }}
              />
            </CardContent>
          </Card>

          {/* Main Features Grid */}
          <Grid container spacing={3}>
            {/* Lesson Plan Card */}
            <Grid item xs={12} lg={6}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 12px 24px rgba(14, 165, 233, 0.12)',
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                <CardContent sx={{ p: 3, pb: 2, flex: lessonPlan ? 0 : 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: 2, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
                      mr: 2
                    }}>
                      <Typography sx={{ fontSize: '1.5rem' }}>📝</Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                        Lesson Plan Generator
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Create comprehensive lesson plans
                      </Typography>
                    </Box>
                  </Box>
                  
                  {!lessonPlan && (
                    <Box sx={{ 
                      mt: 3, 
                      p: 4, 
                      textAlign: 'center',
                      bgcolor: '#f8fafc',
                      borderRadius: 2,
                      border: '2px dashed',
                      borderColor: 'divider',
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        Enter a topic and click generate to create your lesson plan
                      </Typography>
                    </Box>
                  )}
                </CardContent>

                {lessonPlan && (
                  <Box sx={{ 
                    flex: 1,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <Box 
                      className="markdown-content" 
                      sx={{ 
                        flex: 1,
                        p: 3,
                        overflow: 'auto',
                        bgcolor: '#fafbfc',
                      }}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {lessonPlan}
                      </ReactMarkdown>
                    </Box>
                  </Box>
                )}

                <CardActions sx={{ p: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Button 
                    variant="contained" 
                    onClick={generateLessonPlan}
                    disabled={!topic || loading.lessonPlan}
                    fullWidth
                    size="large"
                    sx={{ 
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem',
                      borderRadius: 2,
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
                      }
                    }}
                  >
                    {loading.lessonPlan ? <CircularProgress size={24} color="inherit" /> : '✨ Generate Lesson Plan'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            {/* Quiz Card */}
            <Grid item xs={12} lg={6}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    borderColor: 'secondary.main',
                    boxShadow: '0 12px 24px rgba(20, 184, 166, 0.12)',
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                <CardContent sx={{ p: 3, pb: 2, flex: quiz.length > 0 ? 0 : 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: 2, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)',
                      mr: 2
                    }}>
                      <Typography sx={{ fontSize: '1.5rem' }}>✅</Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                        Quiz Generator
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Interactive questions to test understanding
                      </Typography>
                    </Box>
                  </Box>

                  {quiz.length === 0 && (
                    <Box sx={{ 
                      mt: 3, 
                      p: 4, 
                      textAlign: 'center',
                      bgcolor: '#f0fdfa',
                      borderRadius: 2,
                      border: '2px dashed',
                      borderColor: 'secondary.light',
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        Generate quiz questions to assess student knowledge
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                
                {quiz.length > 0 && (
                  <Box sx={{ 
                    flex: 1,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <Box sx={{ flex: 1, overflow: 'auto', px: 3, pb: 2 }}>
                      {quiz.map((q, i) => (
                        <Box 
                          key={i} 
                          sx={{ 
                            mb: 2.5,
                            p: 2.5,
                            bgcolor: 'white',
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'secondary.light',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(20, 184, 166, 0.1)',
                            }
                          }}
                        >
                          {/* Question */}
                          <Box sx={{ display: 'flex', alignItems: 'start', mb: 2 }}>
                            <Box sx={{ 
                              bgcolor: 'secondary.main', 
                              color: 'white', 
                              px: 1.5, 
                              py: 0.5, 
                              borderRadius: 1.5,
                              mr: 1.5,
                              fontSize: '0.875rem',
                              fontWeight: 700,
                              minWidth: '32px',
                              textAlign: 'center'
                            }}>
                              {i + 1}
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', flex: 1, lineHeight: 1.6 }}>
                              {q.question}
                            </Typography>
                          </Box>
                          
                          {/* Options */}
                          {q.options && q.options.length > 0 && (
                            <Box sx={{ ml: 5.5, mb: 2 }}>
                              {q.options.map((option, optIndex) => {
                                const optionLetter = option.charAt(0);
                                const isCorrect = optionLetter === q.answer;
                                return (
                                  <Box 
                                    key={optIndex}
                                    sx={{ 
                                      display: 'flex',
                                      alignItems: 'center',
                                      p: 1.25,
                                      mb: 1,
                                      borderRadius: 1.5,
                                      bgcolor: isCorrect ? '#f0fdf4' : '#f8fafc',
                                      border: '1px solid',
                                      borderColor: isCorrect ? '#86efac' : '#e2e8f0',
                                      transition: 'all 0.2s ease',
                                      '&:hover': {
                                        borderColor: isCorrect ? '#4ade80' : '#cbd5e1',
                                      }
                                    }}
                                  >
                                    {isCorrect && (
                                      <Box sx={{ 
                                        width: 20, 
                                        height: 20, 
                                        borderRadius: '50%', 
                                        bgcolor: 'success.main',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        mr: 1
                                      }}>
                                        ✓
                                      </Box>
                                    )}
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        fontWeight: isCorrect ? 600 : 400,
                                        color: isCorrect ? 'success.dark' : 'text.secondary',
                                        flex: 1
                                      }}
                                    >
                                      {option}
                                    </Typography>
                                  </Box>
                                );
                              })}
                            </Box>
                          )}

                          {/* Explanation */}
                          {q.explanation && (
                            <Box sx={{ 
                              ml: 5.5,
                              p: 1.5,
                              bgcolor: '#eff6ff',
                              borderRadius: 1.5,
                              borderLeft: '3px solid #3b82f6',
                            }}>
                              <Typography variant="caption" sx={{ color: '#1e40af', fontWeight: 500, display: 'block', mb: 0.5 }}>
                                💡 Explanation:
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.5 }}>
                                {q.explanation}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                <CardActions sx={{ p: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Button 
                    variant="contained" 
                    color="secondary"
                    onClick={generateQuiz}
                    disabled={!topic || loading.quiz}
                    fullWidth
                    size="large"
                    sx={{ 
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem',
                      borderRadius: 2,
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)',
                      }
                    }}
                  >
                    {loading.quiz ? <CircularProgress size={24} color="inherit" /> : '🎯 Generate Quiz'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            {/* Assignment Card */}
            <Grid item xs={12} lg={6}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 12px 24px rgba(14, 165, 233, 0.12)',
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                <CardContent sx={{ p: 3, pb: 2, flex: assignment ? 0 : 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: 2, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
                      mr: 2
                    }}>
                      <Typography sx={{ fontSize: '1.5rem' }}>📋</Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                        Assignment Creator
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Design structured assignments
                      </Typography>
                    </Box>
                  </Box>
                  
                  {!assignment && (
                    <Box sx={{ 
                      mt: 3, 
                      p: 4, 
                      textAlign: 'center',
                      bgcolor: '#f8fafc',
                      borderRadius: 2,
                      border: '2px dashed',
                      borderColor: 'divider',
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        Create engaging assignments for students
                      </Typography>
                    </Box>
                  )}
                </CardContent>

                {assignment && (
                  <Box sx={{ 
                    flex: 1,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <Box 
                      className="markdown-content" 
                      sx={{ 
                        flex: 1,
                        p: 3,
                        overflow: 'auto',
                        bgcolor: '#fafbfc',
                      }}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {assignment}
                      </ReactMarkdown>
                    </Box>
                  </Box>
                )}

                <CardActions sx={{ p: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Button 
                    variant="contained"
                    onClick={generateAssignment}
                    disabled={!topic || loading.assignment}
                    fullWidth
                    size="large"
                    sx={{ 
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem',
                      borderRadius: 2,
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
                      }
                    }}
                  >
                    {loading.assignment ? <CircularProgress size={24} color="inherit" /> : '📝 Create Assignment'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            {/* Summary Card */}
            <Grid item xs={12} lg={6}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    borderColor: 'secondary.main',
                    boxShadow: '0 12px 24px rgba(20, 184, 166, 0.12)',
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                <CardContent sx={{ p: 3, pb: 2, flex: summary ? 0 : 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: 2, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)',
                      mr: 2
                    }}>
                      <Typography sx={{ fontSize: '1.5rem' }}>📊</Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                        Understanding Summary
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Assess student knowledge
                      </Typography>
                    </Box>
                  </Box>
                  
                  {!summary && (
                    <Box sx={{ 
                      mt: 3, 
                      p: 4, 
                      textAlign: 'center',
                      bgcolor: '#f0fdfa',
                      borderRadius: 2,
                      border: '2px dashed',
                      borderColor: 'secondary.light',
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        Analyze student understanding and provide feedback
                      </Typography>
                    </Box>
                  )}
                </CardContent>

                {summary && (
                  <Box sx={{ 
                    flex: 1,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <Box 
                      className="markdown-content" 
                      sx={{ 
                        flex: 1,
                        p: 3,
                        overflow: 'auto',
                        bgcolor: '#fafbfc',
                      }}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {summary}
                      </ReactMarkdown>
                    </Box>
                  </Box>
                )}

                <CardActions sx={{ p: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Button 
                    variant="contained" 
                    color="secondary"
                    onClick={summarizeUnderstanding}
                    disabled={!topic || loading.summary}
                    fullWidth
                    size="large"
                    sx={{ 
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem',
                      borderRadius: 2,
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)',
                      }
                    }}
                  >
                    {loading.summary ? <CircularProgress size={24} color="inherit" /> : '💡 Generate Summary'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            {/* LMS Integration Card */}
            <Grid item xs={12} md={6}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 12px 24px rgba(14, 165, 233, 0.12)',
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                <CardContent sx={{ p: 3, pb: 2, flex: lmsStatus ? 0 : 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: 2, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                      mr: 2
                    }}>
                      <Typography sx={{ fontSize: '1.5rem' }}>🔗</Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                        LMS Integration
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Connect with your platform
                      </Typography>
                    </Box>
                  </Box>

                  {!lmsStatus && (
                    <Box sx={{ 
                      mt: 3, 
                      p: 4, 
                      textAlign: 'center',
                      bgcolor: '#f0fdf4',
                      borderRadius: 2,
                      border: '2px dashed',
                      borderColor: '#86efac',
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        Seamlessly integrate with your Learning Management System
                      </Typography>
                    </Box>
                  )}
                </CardContent>

                {lmsStatus && (
                  <Box sx={{ flex: 1, px: 3, pb: 2 }}>
                    <Box sx={{ 
                      p: 3, 
                      bgcolor: '#f0fdf4',
                      borderRadius: 2,
                      border: '1px solid #86efac',
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ 
                          width: 24, 
                          height: 24, 
                          borderRadius: '50%', 
                          bgcolor: '#10b981',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '0.875rem',
                          fontWeight: 'bold'
                        }}>
                          ✓
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#10b981', flex: 1 }}>
                          {lmsStatus}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}

                <CardActions sx={{ p: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Button 
                    variant="contained"
                    onClick={integrateLMS}
                    disabled={!topic || loading.lms}
                    fullWidth
                    size="large"
                    sx={{ 
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem',
                      borderRadius: 2,
                      bgcolor: '#10b981',
                      boxShadow: 'none',
                      '&:hover': {
                        bgcolor: '#059669',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                      }
                    }}
                  >
                    {loading.lms ? <CircularProgress size={24} color="inherit" /> : '🔌 Integrate with LMS'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            {/* Q&A Card - Full Width */}
            <Grid item xs={12}>
              <Card 
                elevation={0}
                sx={{ 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 12px 24px rgba(14, 165, 233, 0.12)',
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ 
                      width: 56, 
                      height: 56, 
                      borderRadius: 2, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
                      mr: 2.5
                    }}>
                      <Typography sx={{ fontSize: '2rem' }}>💬</Typography>
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                        Interactive Q&A
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ask questions about any topic and get instant explanations
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Grid container spacing={2.5}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          multiline
                          rows={5}
                          label="Context (Optional)"
                          variant="outlined"
                          value={qaContext}
                          onChange={(e) => setQaContext(e.target.value)}
                          placeholder="Provide context or paste relevant content..."
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'white',
                              '& fieldset': {
                                borderWidth: 2,
                                borderColor: 'divider',
                              },
                              '&:hover fieldset': {
                                borderColor: 'primary.light',
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
                          <TextField
                            fullWidth
                            label="Your Question"
                            variant="outlined"
                            value={qaQuestion}
                            onChange={(e) => setQaQuestion(e.target.value)}
                            placeholder="What would you like to know?"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: 'white',
                                '& fieldset': {
                                  borderWidth: 2,
                                  borderColor: 'divider',
                                },
                              },
                            }}
                          />
                          <Button
                            variant="contained"
                            onClick={answerQuestion}
                            disabled={!qaQuestion || loading.qa}
                            fullWidth
                            size="large"
                            sx={{
                              py: 1.75,
                              fontWeight: 600,
                              textTransform: 'none',
                              fontSize: '1rem',
                              borderRadius: 2,
                              boxShadow: 'none',
                              flex: 1,
                              minHeight: '100px',
                              background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
                              '&:hover': {
                                boxShadow: '0 6px 16px rgba(14, 165, 233, 0.3)',
                              }
                            }}
                          >
                            {loading.qa ? <CircularProgress size={24} color="inherit" /> : '🚀 Get Answer'}
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>

                  {qaAnswer && (
                    <Box 
                      className="markdown-content" 
                      sx={{ 
                        p: 3,
                        bgcolor: '#fafbfc',
                        borderRadius: 2,
                        border: '2px solid',
                        borderColor: 'primary.light',
                        maxHeight: '400px',
                        overflow: 'auto',
                      }}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {qaAnswer}
                      </ReactMarkdown>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
