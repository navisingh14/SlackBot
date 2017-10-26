package selenium.tests;

import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.JavascriptExecutor;


import io.github.bonigarcia.wdm.ChromeDriverManager;

public class WebTest
{
//	private static final ThreadLocal<WebDriver> WEB_DRIVER_THREAD_LOCAL = new InheritableThreadLocal<WebDriver>();
	private static WebDriver driver;
	
	@BeforeClass
	public static void setUp() throws Exception 
	{
	
		//driver = new HtmlUnitDriver();
		ChromeDriverManager.getInstance().setup();
		driver = new ChromeDriver();
		
		driver.get("https://" + System.getenv("SLACK_WEB_ADDRESS") + "/");

		// Wait until page loads and we can see a sign in button.
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));

		// Find email and password fields.
		WebElement email = driver.findElement(By.id("email"));
		WebElement pw = driver.findElement(By.id("password"));

		// Enter our email and password
		// If running this from Eclipse, you should specify these variables in the run configurations.
		email.sendKeys(System.getenv("SLACK_EMAIL"));
		pw.sendKeys(System.getenv("SLACK_PASSWORD"));

		// Click
		WebElement signin = driver.findElement(By.id("signin_btn"));
		signin.click();
		
		// Wait until we go to general channel.
		wait.until(ExpectedConditions.titleContains("general"));
	
	}
	
	@AfterClass
	public static void  tearDown() throws Exception
	{
		driver.close();
		driver.quit();
	}

	@Test
	public void TestCase1_HappyPath()
	{
		driver.get("https://" + System.getenv("SLACK_WEB_ADDRESS") + "/messages/D7L8UUE4F/");
		
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.titleContains("botbai"));
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
		
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("schedule a meeting");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'When do you want to start the meeting?']"));
		assertNotNull(msg);
		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		//wait.withTimeout(10, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
		
		actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("Tomorrow at 5pm");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'When do you want to finish the meeting?']"));
		assertNotNull(msg);
		
		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("Tomorrow at 6pm");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'Whom would you like to invite?']"));
		assertNotNull(msg);
		
		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("@Aditya Pandey");
		actions.sendKeys(Keys.RETURN);
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'Success! Meeting has been scheduled']"));
		assertNotNull(msg);
		assertEquals("Success! Meeting has been scheduled", msg.getText());
		
		try
		{
			Thread.sleep(5000);
		}
		catch(Exception ex) {}
	}

	@Test
	public void TestCase1_AlternativePath()
	{
		driver.get("https://" + System.getenv("SLACK_WEB_ADDRESS") + "/messages/D7L8UUE4F/");
		
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.titleContains("botbai"));
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
		
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("schedule a meeting");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'When do you want to start the meeting?']"));
		assertNotNull(msg);
		
		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("Tomorrow 5pm to 6pm");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'Whom would you like to invite?']"));
		assertNotNull(msg);
		
		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("@XYZ");
		actions.sendKeys(Keys.RETURN);
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'They are not valid participants.']"));
		assertNotNull(msg);
		assertEquals("They are not valid participants.", msg.getText());
		
		try
		{
			Thread.sleep(5000);
		}
		catch(Exception ex) {}
	}
	
	@Test
	public void TestCase2_HappyPath()
	{
	
		
		driver = new ChromeDriver();
		WebElement body = driver.findElement(By.tagName("body"));
	    body.sendKeys(Keys.chord(Keys.CONTROL,Keys.SHIFT,"n"));
	    
	    try
		{
			Thread.sleep(2000);
		}
		catch(Exception ex) {}
	    
	  //  ArrayList<String> newtab = new ArrayList<String> (driver.getWindowHandles());
	 //   newtab.remove(oldTab);
	  //  driver.switchTo().window(newtab.get(0));
	    driver.get("https://" + System.getenv("SLACK_WEB_ADDRESS") + "/");
	    
		//driver.get("https://" + System.getenv("SLACK_WEB_ADDRESS") + "/");

		// Wait until page loads and we can see a sign in button.
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));

		// Find email and password fields.
		WebElement email = driver.findElement(By.id("email"));
		WebElement pw = driver.findElement(By.id("password"));

		// Enter our email and password
		// If running this from Eclipse, you should specify these variables in the run configurations.
		email.sendKeys(System.getenv("SLACK_EMAIL"));
		pw.sendKeys(System.getenv("SLACK_PASSWORD"));

		// Click
		WebElement signin = driver.findElement(By.id("signin_btn"));
		signin.click();
		
		// Wait until we go to general channel.
		wait.until(ExpectedConditions.titleContains("general"));
		
		
		driver.get("https://" + System.getenv("SLACK_WEB_ADDRESS") + "/messages/D7L8UUE4F/");
		
		wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.titleContains("botbai"));
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
		
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("update a meeting");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

	//	WebElement msg = driver.findElement(
		//		By.xpath("//span[@class='message_body' and text() = 'Which of these meetings would you want to remove?']"));
//		assertNotNull(msg);
		
		try
		{
			Thread.sleep(5000);
		}
		catch(Exception ex) {}
		
		//WebDriver redirectdriver = new ChromeDriver();
		
		WebElement element = driver.findElement(By.cssSelector("a[href*='http://ec2-54-183-96-241.us-west-1.compute.amazonaws.com:3000/update?user=U7K7WN00L&channel=D7L8UUE4F&meeting_id=1']"));
        JavascriptExecutor js = (JavascriptExecutor)driver;

        js.executeScript("arguments[0].click()", element);
		
	
		
		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'Are you sure you would like to change this meeting?']"));
		assertNotNull(msg);
		assertEquals("Are you sure you would like to change this meeting?", msg.getText());
		
		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("no");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		msg = driver.findElement(
				By.xpath("//span[@class='message_body' and contains(text(),'Cancelling edit!!')]"));
		assertNotNull(msg);
	
		try
		{
			Thread.sleep(5000);
		}
		catch(Exception ex) {}
		
	}
	
	@Test
	public void TestCase2_AlternativePath()
	{
		driver.get("https://" + System.getenv("SLACK_WEB_ADDRESS") + "/messages/D7L8UUE4F/");
		
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.titleContains("botbai"));
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
		
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("Schedule a meeting");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'When do you want to start the meeting?']"));
		assertNotNull(msg);
		
		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("Tomorrow at 5pm");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'When do you want to finish the meeting?']"));
		assertNotNull(msg);
		
		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("Tomorrow at 4pm");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		msg = driver.findElement(
				By.xpath("//span[@class='message_body' and contains(text(),'meeting cannot finish')]"));
		assertNotNull(msg);
		assertEquals("The meeting cannot finish before it starts. What time would do you like to finish the meeting?", msg.getText());
	
		
		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("Abandon");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		
		try
		{
			Thread.sleep(5000);
		}
		catch(Exception ex) {}
	}
	
	@Test
	public void TestCase3_HappyPath()
	{

		
		
		driver.get("https://" + System.getenv("SLACK_WEB_ADDRESS") + "/messages/D7L8UUE4F/");
		
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.titleContains("botbai"));
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);

		
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("delete a meeting");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

	//	WebElement msg = driver.findElement(
		//		By.xpath("//span[@class='message_body' and text() = 'Which of these meetings would you want to remove?']"));
//		assertNotNull(msg);
		
		try
		{
			Thread.sleep(5000);
		}
		catch(Exception ex) {}
		
		//WebDriver redirectdriver = new ChromeDriver();
		
		WebElement element = driver.findElement(By.cssSelector("a[href*='http://ec2-54-183-96-241.us-west-1.compute.amazonaws.com:3000/delete?user=U7K7WN00L&channel=D7L8UUE4F&meeting_id=1']"));
        JavascriptExecutor js = (JavascriptExecutor)driver;

        js.executeScript("arguments[0].click()", element);
		
		try
		{
			Thread.sleep(5000);
		}
		catch(Exception ex) {}
		
		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'Successfully deleted meeting']"));
		assertNotNull(msg);
		assertEquals("Successfully deleted meeting", msg.getText());
	
	}
	
	
	@Test
	// logging with some other user's acoount who do not have a meeting scheduled
	public void TestCase3_AlernatePath()
	{
	//	driver = WEB_DRIVER_THREAD_LOCAL.get();
		String oldTab = driver.getWindowHandle();
		driver = new ChromeDriver();
		WebElement body = driver.findElement(By.tagName("body"));
	    body.sendKeys(Keys.chord(Keys.CONTROL,Keys.SHIFT,"n"));
	    
	    try
		{
			Thread.sleep(2000);
		}
		catch(Exception ex) {}
	    
	    ArrayList<String> newtab = new ArrayList<String> (driver.getWindowHandles());
	    newtab.remove(oldTab);
	  //  driver.switchTo().window(newtab.get(0));
	    driver.get("https://" + System.getenv("SLACK_WEB_ADDRESS") + "/");
	    
		//driver.get("https://" + System.getenv("SLACK_WEB_ADDRESS") + "/");

		// Wait until page loads and we can see a sign in button.
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));

		// Find email and password fields.
		WebElement email = driver.findElement(By.id("email"));
		WebElement pw = driver.findElement(By.id("password"));

		// Enter our email and password
		// If running this from Eclipse, you should specify these variables in the run configurations.
		email.sendKeys(System.getenv("SLACK_EMAIL2"));
		pw.sendKeys(System.getenv("SLACK_PASSWORD2"));

		// Click
		WebElement signin = driver.findElement(By.id("signin_btn"));
		signin.click();
		
		// Wait until we go to general channel.
		wait.until(ExpectedConditions.titleContains("general"));
	    
	    
		driver.get("https://" + System.getenv("SLACK_WEB_ADDRESS") + "/messages/D7MP423QS/");
		
		wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.titleContains("botbai"));
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
		
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("delete a meeting");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		  try
			{
				Thread.sleep(10000);
			}
			catch(Exception ex) {}
		wait.withTimeout(10, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);


		try
		{
			Thread.sleep(7000);
		}
		catch(Exception ex) {}

	}
	
	@Test
	public void TestCase4_HappyPath()
	{
		driver.get("https://" + System.getenv("SLACK_WEB_ADDRESS") + "/messages/D7L8UUE4F/");
		
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.titleContains("botbai"));
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
		
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("list meetings");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		
		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'What day would you like to list the meetings for?']"));
		assertNotNull(msg);
		assertEquals("What day would you like to list the meetings for?", msg.getText());
		
		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("today");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		
		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'Do you have a time-frame in mind?']"));
		assertNotNull(msg);
		
		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("5pm");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		
		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'Till what time do you want me to check the calendars for?']"));
		assertNotNull(msg);
		
		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("10pm");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		
		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		msg = driver.findElement(
				By.xpath("//span[@class='message_body' and contains(text(),'list of meetings')]"));
		assertNotNull(msg);
//		assertEquals("Here is the list of meetings", msg.getText());
		try
		{
			Thread.sleep(5000);
		}
		catch(Exception ex) {}
			
	}
	
	@Test
	public void TestCase4_AlternativePath()
	{
		driver = new ChromeDriver();
		WebElement body = driver.findElement(By.tagName("body"));
	    body.sendKeys(Keys.chord(Keys.CONTROL,Keys.SHIFT,"n"));
	    
	    try
		{
			Thread.sleep(2000);
		}
		catch(Exception ex) {}
	    
	 
	    driver.get("https://" + System.getenv("SLACK_WEB_ADDRESS") + "/");
	    
		//driver.get("https://" + System.getenv("SLACK_WEB_ADDRESS") + "/");

		// Wait until page loads and we can see a sign in button.
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));

		// Find email and password fields.
		WebElement email = driver.findElement(By.id("email"));
		WebElement pw = driver.findElement(By.id("password"));

		// Enter our email and password
		// If running this from Eclipse, you should specify these variables in the run configurations.
		email.sendKeys(System.getenv("SLACK_EMAIL2"));
		pw.sendKeys(System.getenv("SLACK_PASSWORD2"));

		// Click
		WebElement signin = driver.findElement(By.id("signin_btn"));
		signin.click();
		
		// Wait until we go to general channel.
		wait.until(ExpectedConditions.titleContains("general"));
	    
	    
		driver.get("https://" + System.getenv("SLACK_WEB_ADDRESS") + "/messages/D7MP423QS/");
		
		wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.titleContains("botbai"));
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
		
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("list meetings");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'What day would you like to list the meetings for?']"));
		assertNotNull(msg);
		assertEquals("What day would you like to list the meetings for?", msg.getText());
		
		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("today");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		
		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'Do you have a time-frame in mind?']"));
		assertNotNull(msg);
		
		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("5pm");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		
		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'Till what time do you want me to check the calendars for?']"));
		assertNotNull(msg);
		
		try
		{
			Thread.sleep(3000);
		}
		catch(Exception ex) {}
		
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("6pm");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		
		try
		{
			Thread.sleep(5000);
		}
		catch(Exception ex) {}
		
		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);


		try
		{
			Thread.sleep(5000);
		}
		catch(Exception ex) {}
		
		
	}
}





