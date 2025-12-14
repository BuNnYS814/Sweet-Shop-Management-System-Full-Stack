from app.database import SessionLocal
from app.models import User, Sweet
from app.auth.utils import hash_password

def init_db():
    db = SessionLocal()
    try:
        # Create admin user if not exists
        admin = db.query(User).filter(User.email == "admin@sweetshop.com").first()
        if not admin:
            admin = User(
                email="admin@sweetshop.com",
                hashed_password=hash_password("admin123"),
                is_admin=True
            )
            db.add(admin)
        
        # Add sample sweets if none exist
        if db.query(Sweet).count() == 0:
            sweets = [
                Sweet(name="Chocolate Bar", category="Chocolate", price=2.50, quantity=50),
                Sweet(name="Gummy Bears", category="Gummies", price=3.00, quantity=30),
                Sweet(name="Lollipop", category="Hard Candy", price=1.50, quantity=100),
                Sweet(name="Jelly Beans", category="Gummies", price=2.75, quantity=40),
                Sweet(name="Caramel", category="Caramel", price=2.00, quantity=60),
            ]
            for sweet in sweets:
                db.add(sweet)
        
        db.commit()
        print("Database initialized successfully!")
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()

