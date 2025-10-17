from RPLCD.gpio import CharLCD
import RPi.GPIO as GPIO
from time import sleep

GPIO.setwarnings(False)

lcd = CharLCD(cols=16, rows=2,
              pin_rs=7, pin_e=18,
              pins_data=[16, 11, 12, 15],
              numbering_mode=GPIO.BOARD)

sleep(1)
lcd.clear()
lcd.write_string('LCD funcionando')
sleep(10)
lcd.clear()
lcd.close(clear=True)
