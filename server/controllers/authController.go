package controllers

import (
	"net/http"
	"os"
	"server_go/initializers"
	"server_go/models"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// CreateUser handles the creation of a new user.
// It binds the JSON input to the AuthInput model, checks if the username is already taken,
// hashes the password, creates the user in the database, and returns the created user as JSON.
func CreateUser(c *gin.Context) {  
	var authInput models.AuthInput  

	// Bind the JSON input to the authInput variable.  
	if err := c.ShouldBindJSON(&authInput); err != nil {  
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})  
		return  
	}  

	var userFound models.User  

	// Check if the username is already taken.  
	initializers.DB.Where("username=?", authInput.Username).Find(&userFound)  
	if userFound.ID != 0 {  
		c.JSON(http.StatusBadRequest, gin.H{"error": "username already used"})  
		return  
	}  

	// Hash the password.  
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(authInput.Password), bcrypt.DefaultCost)  
	if err != nil {  
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})  
		return  
	}  

	// Create the user in the database.  
	user := models.User{  
		Username: authInput.Username,  
		Password: string(passwordHash),  
	}  
	initializers.DB.Create(&user)  

	// Return the created user as JSON.  
	c.JSON(http.StatusOK, gin.H{"data": user})  
}  

// Login handles user login.  
// It binds the JSON input to the AuthInput model, retrieves the user from the database,  
// compares the provided password with the stored hash, generates a JWT token,  
// and returns the token as JSON.  
func Login(c *gin.Context) {  
	var authInput models.AuthInput  

	// Bind the JSON input to the authInput variable.  
	if err := c.ShouldBindJSON(&authInput); err != nil {  
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})  
		return  
	}  

	var userFound models.User  

	// Retrieve the user from the database.  
	initializers.DB.Where("username=?", authInput.Username).Find(&userFound)  
	if userFound.ID == 0 {  
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})  
		return  
	}  

	// Compare the provided password with the stored hash.  
	if err := bcrypt.CompareHashAndPassword([]byte(userFound.Password), []byte(authInput.Password)); err != nil {  
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid password"})  
		return  
	}  

	// Generate a JWT token.  
	generateToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{  
		"id":  userFound.ID,  
		"exp": time.Now().Add(time.Hour * 24).Unix(),  
	})  

	token, err := generateToken.SignedString([]byte(os.Getenv("SECRET")))  
	if err != nil {  
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed to generate token"})  
		return  
	}  

	// Return the token as JSON.  
	c.JSON(http.StatusOK, gin.H{  
		"token":    token,  
		"username": userFound.Username,  
		"id":       userFound.ID,  
	})  
}