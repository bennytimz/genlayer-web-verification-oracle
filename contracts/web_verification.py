from genlayer import Contract, AIReasoning
import requests

class WebVerificationContract(Contract):
    """
    Mini web verification oracle.
    Input: URL + Question
    Output: { answer: True/False, reasoning: str }
    """

    def __init__(self):
        super().__init__(name="WebVerificationContract")
        self.ai = AIReasoning()

    def verify_url(self, url: str, question: str) -> dict:
        """
        Fetch webpage content and ask GenLayer AI to verify the question.
        Returns: { answer: bool, reasoning: str }
        """
        try:
            resp = requests.get(url, timeout=5)
            resp.raise_for_status()
            content = resp.text
        except Exception as e:
            return {"answer": False, "reasoning": f"Failed to fetch URL: {e}"}

        # Use GenLayer AI to reason about content
        reasoning_result = self.ai.reason(
            context=content,
            prompt=f"Answer the following question based on the text: {question}. Respond with True or False, and give a short explanation."
        )

        # Extract answer from reasoning_result (assuming it returns dict)
        answer = reasoning_result.get("answer", False)
        reasoning = reasoning_result.get("reasoning", "")

        return {"answer": answer, "reasoning": reasoning}


# Example usage
if __name__ == "__main__":
    contract = WebVerificationContract()
    result = contract.verify_url(
        url="https://en.wikipedia.org/wiki/Python_(programming_language)",
        question="Is Python a programming language?"
    )
    print(result)
