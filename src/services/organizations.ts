export interface Organization {
  id: number;
  title: {
    rendered: string;
  };
  slug: string;
}

export const organizationsService = {
  async getAll(): Promise<Organization[]> {
    try {
      // Organizations are exposed via WordPress REST API since they have 'show_in_rest' => true
      const baseUrl = '/wp-json/wp/v2';
      const response = await fetch(`${baseUrl}/organization?per_page=100`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch organizations');
      }
      
      return await response.json();
    } catch (error) {
      return [];
    }
  }
};