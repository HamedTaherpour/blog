import BackgroundSection from '@/components/BackgroundSection'
import SectionBecomeAnAuthor from '@/components/SectionBecomeAnAuthor'
import SectionLargeSlider from '@/components/SectionLargeSlider'
import SectionMagazine4 from '@/components/SectionMagazine4'
import SectionMagazine8 from '@/components/SectionMagazine8'
import SectionMagazine9 from '@/components/SectionMagazine9'
import SectionSliderNewCategories from '@/components/SectionSliderNewCategories'
import SectionSliderPosts from '@/components/SectionSliderPosts'
import { fetchAudioPosts, fetchCategories, fetchMostViewedPosts, fetchPosts } from '@/lib/api'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Αρχική',
  description: 'Αρχική σελίδα της εφαρμογής που παρουσιάζει διάφορες ενότητες και άρθρα.',
}

const Page = async () => {
  // Fetch posts and categories from API service
  const { posts } = await fetchPosts({
    status: 'PUBLISHED',
    limit: 20,
  })

  const categories = await fetchCategories()

  // Fetch most viewed posts for SectionMagazine4
  const mostViewedPosts = await fetchMostViewedPosts(6)

  // Fetch audio posts for SectionMagazine8 and SectionMagazine9
  const audioPosts = await fetchAudioPosts(9)

  return (
    <div className="relative pb-28 lg:pb-32">
      <div className="relative container space-y-28 lg:space-y-32">
        <SectionLargeSlider
          heading="Επιλογή Εκδότη"
          subHeading="Τα πιο εξαιρετικά άρθρα"
          className="pt-10 lg:pt-20"
          posts={posts}
        />

        <SectionSliderNewCategories
          heading="Εξερευνήστε κατηγορίες"
          subHeading="Εξερευνήστε τις κατηγορίες"
          categories={categories.slice(0, 10)}
        />

        <div className="relative py-16 lg:py-20">
          <BackgroundSection />
          <SectionSliderPosts
            postCardName="card10V2"
            heading="Εξερευνήστε τα τελευταία άρθρα"
            subHeading="Κάντε κλικ στο εικονίδιο για να απολαύσετε τη μουσική"
            posts={posts.slice(0, 6)}
          />
        </div>

        <SectionMagazine4
          heading="Περισσότερο προβεβλημένα άρθρα"
          subHeading="Εξερευνήστε τα περισσότερο προβεβλημένα άρθρα"
          posts={mostViewedPosts}
          categories={categories}
        />

        <SectionBecomeAnAuthor
          subHeading="αλλάξτε τις δυνάμεις σχεδιασμού σας"
          excerpt="Γίνετε συγγραφέας μπορείτε να κερδίσετε επιπλέον εισόδημα γράφοντας άρθρα. Διαβάστε και μοιραστείτε νέες προοπτικές για σχεδόν κάθε θέμα. Όλοι είναι ευπρόσδεκτοι."
          buttonText="Γίνετε συγγραφέας"
          heading="Γίνετε συγγραφέας και μοιραστείτε τις μεγάλες σας ιστορίες"
        />

        <div className="container space-y-28 lg:space-y-32">
          <SectionMagazine8
            posts={audioPosts.slice(0, 6)}
            heading="Stream live audio"
            dimHeading="Κάντε κλικ στο εικονίδιο για να απολαύσετε τη μουσική"
          />

          <div className="relative py-16 lg:py-20">
            <BackgroundSection />
            <SectionMagazine9
              posts={audioPosts.slice(0, 9)}
              heading="Stream live audio"
              dimHeading="Κάντε κλικ στο εικονίδιο για να απολαύσετε τη μουσική"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
