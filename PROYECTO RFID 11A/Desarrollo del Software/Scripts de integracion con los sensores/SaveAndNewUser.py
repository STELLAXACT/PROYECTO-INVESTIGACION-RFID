#!/usr/bin/env python

import time
from mfrc522 import SimpleMFRC522
import mysql.connector
from RPLCD.gpio import CharLCD
import RPi.GPIO as GPIO
from time import sleep

GPIO.setwarnings(False)

lcd = CharLCD(cols=16, rows=2,
              pin_rs=7, pin_e=18,
              pins_data=[16, 11, 12, 15],
              numbering_mode=GPIO.BOARD)

db = mysql.connector.connect(
    host="localhost",
    user="attendanceadmin",
    passwd="pimylifeup",
    database="attendancesystem"
)

cursor = db.cursor()
reader = SimpleMFRC522()

def scroll_text(lcd, text, row=0, delay=0.3):
    """Desplaza un texto largo de derecha a izquierda en una línea específica del LCD."""
    if len(text) <= 16:
        lcd.cursor_pos = (row, 0)
        lcd.write_string(text.ljust(16))
        return

    display_text = text + "   "  # Espacio entre ciclos
    for i in range(len(display_text) - 15):
        lcd.cursor_pos = (row, 0)
        lcd.write_string(display_text[i:i+16])
        time.sleep(delay)

try:
    while True:
        lcd.clear()
        lcd.write_string('Esperando informacion')
        print('Place Card to record attendance')
        
        id, text = reader.read()

        cursor.execute("SELECT id, name FROM users WHERE rfid_uid = %s", (id,))
        result = cursor.fetchone()

        if cursor.rowcount >= 1:
            lcd.clear()
            lcd.write_string(f"Welcome\n{result[1][:16]}")
            print(f"Welcome {result[1]}")
            cursor.execute("INSERT INTO attendance (user_id) VALUES (%s)", (result[0],))
            db.commit()
        else:
            lcd.clear()
            lcd.write_string("Usuario no existe")
            print("User does not exist.")
            sleep(2)

            # Mostrar mensaje de confirmación en LCD con scroll
            lcd.clear()
            scroll_text(lcd, "Desea agregar al usuario? (ver consola)", row=0)
            lcd.cursor_pos = (1, 0)
            lcd.write_string("s = si, n = no")
            print("¿Agregar nuevo usuario? (s/n): ")
            respuesta = input("¿Agregar nuevo usuario? (s/n): ").strip().lower()

            if respuesta == "s":
                lcd.clear()
                lcd.write_string("Ingresa nombre")
                print("Enter new name")
                new_name = input("Nombre: ").strip()

                if new_name:
                    cursor.execute("INSERT INTO users (name, rfid_uid) VALUES (%s, %s)", (new_name, id))
                    db.commit()
                    print(f"Usuario '{new_name}' guardado")
                    lcd.clear()
                    lcd.write_string(f"{new_name[:16]}\nRegistrado")
                else:
                    print("Nombre inválido. No se registró el usuario.")
                    lcd.clear()
                    lcd.write_string("Nombre invalido")
            else:
                print("No se registró el usuario.")
                lcd.clear()
                lcd.write_string("Registro cancelado")

        time.sleep(2)

finally:
    GPIO.cleanup()
    lcd.clear()
    lcd.write_string("Sistema cerrado")
    print("EXIT")
