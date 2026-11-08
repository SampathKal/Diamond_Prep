import { Link } from "react-router-dom"
import { PageHead } from "@/components/Page"

export default function About({ notFound = false }: { notFound?: boolean }) {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHead kicker={notFound ? "404" : "About"} title={notFound ? "Page not found" : "About Diamond"}>
        {notFound ? "That page doesn't exist." : "Diamond teaches SAT method choice: recognize the pattern, pick the fastest method, and know when Desmos helps and when it does not."}
      </PageHead>
      {!notFound && (
        <div className="box space-y-3 p-5">
          <p>All practice questions are original. Explanations say which method is faster and why.</p>
          <p>Diamond is an independent study tool and is not affiliated with or endorsed by the College Board. SAT is a registered trademark of the College Board. Desmos is a trademark of Desmos Studio PBC; the embedded calculator uses the official Desmos API.</p>
          <p>Your progress and profile are stored only in your browser.</p>
        </div>
      )}
      <Link to="/" className="btn mt-6">Back home</Link>
    </div>
  )
}
