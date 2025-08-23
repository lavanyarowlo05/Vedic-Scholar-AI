
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export async function addQuestion(question, answer) {
  await addDoc(collection(db, "questions"), {
    question,
    answer,
    createdAt: new Date(),
  });
}