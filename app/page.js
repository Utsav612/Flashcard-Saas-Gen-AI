"use client"; // Add this line at the top

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Container,
  Divider,
  IconButton,
} from "@mui/material";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { CheckCircleOutline, Cloud, School } from "@mui/icons-material";
import getStripe from "../utils/get-stripe";

export default function HomePage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const checkoutSession = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { origin: "http://localhost:3000" },
      });
      const checkoutSessionJson = await checkoutSession.json();

      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      });

      if (error) {
        console.warn(error.message);
      }
    } catch (error) {
      console.error("Error during Stripe checkout:", error);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Header and Navigation */}
      <AppBar position="static" sx={{ backgroundColor: "#673ab7" }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">
              Login
            </Button>
            <Button color="inherit" href="/sign-up">
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: "#f5f5f5",
          py: 8,
          textAlign: "center",
          backgroundImage: "url('/background-pattern.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#673ab7" }}
          >
            Elevate Your Learning Experience
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ color: "#333", mb: 4 }}
          >
            Create and master flashcards with ease. Anytime, anywhere.
          </Typography>
          <Button
            variant="contained"
            size="large"
            color="primary"
            sx={{ px: 4, py: 2 }}
            href="/generate"
          >
            Get Started
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ my: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center">
          Our Features
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card elevation={3} sx={{ p: 3, textAlign: "center" }}>
              <IconButton color="primary" sx={{ fontSize: 40 }}>
                <CheckCircleOutline />
              </IconButton>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Easy Flashcard Creation
                </Typography>
                <Typography>
                  Create flashcards quickly from any text with just a few
                  clicks.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card elevation={3} sx={{ p: 3, textAlign: "center" }}>
              <IconButton color="primary" sx={{ fontSize: 40 }}>
                <Cloud />
              </IconButton>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Cloud Storage
                </Typography>
                <Typography>
                  Access your flashcards from any device at any time.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card elevation={3} sx={{ p: 3, textAlign: "center" }}>
              <IconButton color="primary" sx={{ fontSize: 40 }}>
                <School />
              </IconButton>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Advanced Study Modes
                </Typography>
                <Typography>
                  Utilize various study modes like spaced repetition to enhance
                  your learning.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Pricing Section */}
      <Box
        sx={{
          backgroundColor: "#fafafa",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container>
          <Typography variant="h4" component="h2" gutterBottom>
            Pricing Plans
          </Typography>
          <Typography sx={{ mb: 4 }}>
            Choose a plan that suits your needs.
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={4} sx={{ p: 4 }}>
                <Typography variant="h6" component="h3">
                  Free Plan
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  Enjoy basic features with limited storage.
                </Typography>
                <Divider sx={{ my: 2 }} />
                <CardActions>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Choose Free Plan
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={4} sx={{ p: 4 }}>
                <Typography variant="h6" component="h3">
                  Pro Plan
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  Unlock all features and unlimited storage for just
                  $9.99/month.
                </Typography>
                <Divider sx={{ my: 2 }} />
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Choose Pro Plan"}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
