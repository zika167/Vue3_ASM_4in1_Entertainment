<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <div class="footer-brand">
            <img 
              src="https://res.cloudinary.com/dlpi2u0ds/image/upload/v1763189405/logojava4-Photoroom_bgg2tz.png" 
              alt="4in1 Logo" 
              class="footer-logo"
            >
            <span class="footer-brand-text">
              <span class="first-letter">4</span>IN<span class="first-letter">1</span> ENTERTAINMENT
            </span>
          </div>
          <p class="footer-description">Nền tảng chia sẻ video hàng đầu Việt Nam</p>
        </div>
        
        <div class="footer-section">
          <h2 class="footer-title">THÔNG TIN LIÊN HỆ</h2>
          <ul class="footer-list">
            <li><i class="bi bi-geo-alt-fill"></i> 123 Đường ABC, TP.HCM</li>
            <li><i class="bi bi-telephone-fill"></i> 0123 456 789</li>
            <li><i class="bi bi-envelope-fill"></i> info@4in1.com</li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h2 class="footer-title">LIÊN KẾT</h2>
          <ul class="footer-list">
            <li><router-link to="/">Trang chủ</router-link></li>
            <li><router-link to="/favorites">Video yêu thích</router-link></li>
            <li><router-link to="/account">Cài đặt tài khoản</router-link></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h2 class="footer-title">THEO DÕI CHÚNG TÔI</h2>
          <div class="footer-social">
            <a href="#" class="social-link"><i class="bi bi-facebook"></i></a>
            <a href="#" class="social-link"><i class="bi bi-twitter"></i></a>
            <a href="#" class="social-link"><i class="bi bi-instagram"></i></a>
            <a href="#" class="social-link"><i class="bi bi-youtube"></i></a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>© 2025 4IN1 - Assignment Java 4. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Footer component - no logic needed
</script>

<style scoped>
.app-footer {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: #90EE90;
  margin-top: auto;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.3);
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem 0;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(144, 238, 144, 0.2);
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.footer-logo {
  height: 50px;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.footer-brand-text {
  color: #FFD700;
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 1px;
}

.first-letter {
  font-size: 1.5em;
  font-weight: 800;
}

.footer-description {
  color: #90EE90;
  font-size: 0.9rem;
  margin: 0;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-title {
  color: #FFD700;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 1rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.footer-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 2px;
  background: #90EE90;
}

.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-list li {
  margin-bottom: 0.8rem;
  color: #90EE90;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-list li i {
  color: #FFD700;
  font-size: 1rem;
}

.footer-list a {
  color: #90EE90;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-list a:hover {
  color: #98FB98;
}

.footer-social {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(144, 238, 144, 0.1);
  color: #90EE90;
  border-radius: 50%;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  text-decoration: none;
}

.social-link:hover {
  background: rgba(144, 238, 144, 0.2);
  color: #98FB98;
  transform: translateY(-3px);
}

.footer-bottom {
  padding: 1.5rem 0;
  text-align: center;
}

.footer-bottom p {
  margin: 0;
  color: #90EE90;
  font-size: 0.9rem;
}

@media (max-width: 992px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .footer-section {
    text-align: center;
  }

  .footer-brand {
    justify-content: center;
  }

  .footer-title::after {
    left: 50%;
    transform: translateX(-50%);
  }

  .footer-list li {
    justify-content: center;
  }

  .footer-social {
    justify-content: center;
  }
}
</style>
