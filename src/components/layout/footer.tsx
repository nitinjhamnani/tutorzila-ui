export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} TutorMate. All rights reserved.</p>
        <p className="mt-1">Your journey to smarter learning starts here.</p>
      </div>
    </footer>
  );
}
