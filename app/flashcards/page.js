import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { doc, collection, getDocs } from "firebase/firestore";
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { db } from "../firebase"; // Adjust the import based on your Firebase setup

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});

  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return;

      const colRef = collection(db, "users", user.id, "flashcards", search);
      const docs = await getDocs(colRef);
      const flashcards = [];
      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() });
      });
      setFlashcards(flashcards);
    }
    getFlashcard();
  }, [search, user]);

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard) => (
          <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                <CardContent>
                  <Box
                    sx={{
                      perspective: "1000px",
                    }}
                  >
                    <Box
                      sx={{
                        transformStyle: "preserve-3d",
                        transition: "transform 0.6s",
                        transform: flipped[flashcard.id]
                          ? "rotateY(180deg)"
                          : "none",
                      }}
                    >
                      <Box
                        sx={{
                          backfaceVisibility: "hidden",
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          display: flipped[flashcard.id] ? "none" : "block",
                        }}
                      >
                        <Typography variant="h5" component="div">
                          {flashcard.front}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          display: flipped[flashcard.id] ? "block" : "none",
                        }}
                      >
                        <Typography variant="h5" component="div">
                          {flashcard.back}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
