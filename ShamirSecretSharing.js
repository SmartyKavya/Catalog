import org.json.JSONArray;
import org.json.JSONObject;
import java.math.BigInteger;
import java.util.Scanner;

public class ShamirSecretSharing {

    // Function to parse the input JSON and return the points (x, y) as a 2D array
    public static int[][] parseInput(String jsonInput) {
        JSONObject jsonObject = new JSONObject(jsonInput);
        JSONArray keysArray = jsonObject.getJSONArray("keys");

        int[][] points = new int[keysArray.length()][2]; // To store x and y values

        for (int i = 0; i < keysArray.length(); i++) {
            JSONObject keyObj = keysArray.getJSONObject(i);
            int x = keyObj.getInt("key");  // Extract the x value (as integer)
            String base = keyObj.getString("base"); // Extract the base of y value
            String value = keyObj.getString("value"); // Extract the encoded y value
            
            // Convert the y value from its base to base 10
            int y = decodeValue(base, value);
            
            // Store the (x, y) pair
            points[i][0] = x;
            points[i][1] = y;
        }
        
        return points;
    }

    // Helper function to decode the value from the given base to base 10
    public static int decodeValue(String base, String value) {
        int baseInt = Integer.parseInt(base);  // Convert the base to an integer
        return new BigInteger(value, baseInt).intValue(); // Convert the value to base 10 integer
    }

    // Function to calculate the Lagrange interpolation and find the constant term (c)
    public static int findConstantTerm(int[][] points, int k) {
        int constantTerm = 0;  // This will hold the final constant term (c)

        for (int i = 0; i < k; i++) {
            int xi = points[i][0];
            int yi = points[i][1];

            // Calculate the Lagrange basis polynomial L(i)
            double li = 1.0;
            for (int j = 0; j < k; j++) {
                if (i != j) {
                    int xj = points[j][0];
                    li *= (0 - xj) / (double) (xi - xj);
                }
            }

            // Accumulate the contribution of each term
            constantTerm += li * yi;
        }

        return (int) Math.round(constantTerm);  // Return the constant term
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // Prompt the user to input the JSON string
        System.out.println("Please enter the JSON input (for example, as shown below):");
        System.out.println("{ \"keys\": [ {\"key\": 3, \"base\": \"10\", \"value\": \"4\"}, {\"key\": 21, \"base\": \"2\", \"value\": \"111\"}, {\"key\": 12, \"base\": \"4\", \"value\": \"213\"} ] }");

        // Read the entire JSON input from the user
        StringBuilder jsonInput = new StringBuilder();
        while (scanner.hasNextLine()) {
            String line = scanner.nextLine();
            if (line.isEmpty()) {  // Stop reading input when an empty line is encountered
                break;
            }
            jsonInput.append(line);
        }

        // Parse the input JSON and decode points
        int[][] points = parseInput(jsonInput.toString());

        // Assuming k (minimum number of roots to solve the polynomial) is the number of points provided
        int k = points.length;

        // Find the constant term (c)
        int constantTerm = findConstantTerm(points, k);

        // Output the constant term
        System.out.println("The constant term (c) is: " + constantTerm);

        // Close the scanner
        scanner.close();
    }
}