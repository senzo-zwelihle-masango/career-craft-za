import React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { BubbleChatIcon } from "@hugeicons/core-free-icons"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
import { getAllReviews } from "@/lib/actions/admin/feedback-review"
import { ReviewsTable } from "@/components/admin/reviews/reviews-table"

const AdminReviewsPage = async () => {
  const reviews = await getAllReviews()

  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"full"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      bleed={"none"}
      centered={false}
    >
      <div className="mb-5">
        <Heading
          as="h1"
          font={"none"}
          size={"4xl"}
          weight={"semibold"}
          tracking={"normal"}
          leading={"normal"}
          transform={"normal"}
          italic={false}
          margin={"none"}
        >
          Reviews
        </Heading>
      </div>

      {reviews.length === 0 ? (
        <div className="my-40 flex flex-col items-center justify-center">
          <Heading size="sm" margin="md">
            No Reviews Found
          </Heading>
          <HugeiconsIcon icon={BubbleChatIcon} className="size-20" />
        </div>
      ) : (
        <ReviewsTable reviews={reviews} />
      )}
    </Container>
  )
}

export default AdminReviewsPage
