export const DEFAULT_SNIPPETS = {
  cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    vector<int> nums = {5, 2, 8, 1, 9};
    sort(nums.begin(), nums.end());
    
    cout << "Sorted array: ";
    for (int x : nums) cout << x << " ";
    cout << "\\n";
    
    return 0;
}`,
  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        int[] nums = {5, 2, 8, 1, 9};
        Arrays.sort(nums);
        System.out.println("Sorted: " + Arrays.toString(nums));
    }
}`,
  python: `def solve():
    nums = [5, 2, 8, 1, 9]
    nums.sort()
    print(f"Sorted array: {nums}")

if __name__ == "__main__":
    solve()`,
  javascript: `function solve() {
    const nums = [5, 2, 8, 1, 9];
    nums.sort((a, b) => a - b);
    console.log("Sorted array:", nums);
}

solve();`,
} as const;

export const DEFAULT_CODE_SNIPPETS = DEFAULT_SNIPPETS;
export type SupportedLanguage = keyof typeof DEFAULT_SNIPPETS;

